import React, { useState, useContext, useEffect } from "react";
import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { getAuthToken } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { patch, destroy } from "src/utils/requests";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import { H5, P2, P3, Caption } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/divider";
import Tag from "src/components/design_system/tag";

import { passwordMatchesRequirements } from "src/components/talent/utils/passwordRequirements";

const uppyProfile = new Uppy({
  meta: { type: "avatar" },
  restrictions: {
    maxFileSize: 5120000,
    allowedFileTypes: [".jpg", ".png", ".jpeg"],
  },
  autoProceed: true,
});

uppyProfile.use(AwsS3Multipart, {
  limit: 4,
  companionUrl: "/",
  companionHeaders: {
    "X-CSRF-Token": getAuthToken(),
  },
});

const EditSupporter = ({ id, username, email, profilePictureUrl }) => {
  const [settings, setSettings] = useState({
    username: username || "",
    email: email || "",
    currentPassword: "",
    newPassword: "",
    profilePictureUrl: profilePictureUrl,
    s3Data: null,
  });
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [uploaded, setUploaded] = useState({ profile: false });
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
  });
  const {
    valid: validPassword,
    errors,
    tags,
  } = passwordMatchesRequirements(settings.newPassword);
  const usernameRegex = /^[a-z0-9]*$/;

  const theme = useContext(ThemeContext);

  useEffect(() => {
    uppyProfile.on("upload-success", (file, response) => {
      setSettings((prev) => ({
        ...prev,
        profilePictureUrl: response.uploadURL,
        s3Data: {
          id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
          storage: "cache",
          metadata: {
            size: file.size,
            filename: file.name,
            mime_type: file.type,
          },
        },
      }));
      setUploaded((prev) => ({ ...prev, profile: true }));
      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
      setValidationErrors((prev) => ({ ...prev, profilePictureSize: false }));
    });
    uppyProfile.on("restriction-failed", () => {
      uppyProfile.reset();
      setValidationErrors((prev) => ({ ...prev, profilePictureSize: true }));
    });
  }, []);

  const updateUser = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        email: settings.email,
        username: settings.username,
        new_password: settings.newPassword,
        current_password: settings.currentPassword,
      },
      investor: {
        profile_picture_data: { ...settings.s3Data },
      },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors) {
        setSaving((prev) => ({ ...prev, loading: false, profile: true }));
        setSettings((prev) => ({
          ...prev,
          newPassword: "",
          currentPassword: "",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }

    setSaving((prev) => ({ ...prev, loading: false }));
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${id}`).catch(() =>
      setValidationErrors((prev) => ({ ...prev, deleting: true }))
    );

    if (response && response.success) {
      window.location.href = "/";
    } else {
      setValidationErrors((prev) => ({ ...prev, deleting: true }));
    }
  };

  const changeAttribute = (attribute, value) => {
    if (attribute == "currentPassword" && validationErrors.currentPassword) {
      setValidationErrors((prev) => ({ ...prev, currentPassword: false }));
    }
    if (attribute == "username") {
      if (usernameRegex.test(value)) {
        setValidationErrors((prev) => ({ ...prev, username: false }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          username: "Username only allows lower case letters and numbers",
        }));
      }
    }
    setSettings((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const cannotSaveSettings = () =>
    settings.username.length == 0 ||
    !!validationErrors.username ||
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    (!!settings.newPassword && !validPassword);

  const cannotChangePassword = () =>
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    settings.currentPassword.length < 8 ||
    settings.newPassword.length < 8 ||
    (!!settings.newPassword && !validPassword);

  return (
    <div className="d-flex flex-column mx-auto align-items-center p-3 edit-profile-content">
      <H5
        className="w-100 text-left"
        mode={theme.mode()}
        text="Account Settings"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={theme.mode()}
        text="Update your username and manage your account"
      />
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        <TalentProfilePicture src={settings.profilePictureUrl} height={80} />
        <div className="ml-3 d-flex flex-column">
          <div className="d-flex align-items-center">
            <FileInput
              uppy={uppyProfile}
              pretty
              inputName="files[]"
              locale={{
                strings: {
                  chooseFiles: "Choose Profile Picture",
                },
              }}
            />
            {uploadingFileS3 == "profile" && (
              <P2 text="Uploading" className="ml-2 text-black" bold />
            )}
            {uploadingFileS3 != "profile" && uploaded.profile && (
              <P2 text="Uploaded File" className="ml-2 text-black" bold />
            )}
            {validationErrors?.profilePictureSize && (
              <P2 text="File is too large." className="ml-2 text-danger" bold />
            )}
          </div>
          <P2 text="JPG or PNG. Max 1MB" mode={theme.mode()} />
        </div>
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Username"}
          mode={theme.mode()}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings.username}
          className="w-100"
          required={true}
          error={validationErrors?.username}
        />
        {validationErrors?.username && (
          <Caption className="text-danger" text={validationErrors.username} />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Email"}
          type="email"
          mode={theme.mode()}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings.email}
          className="w-100"
          required={true}
          error={validationErrors?.email}
        />
        {validationErrors?.email && (
          <Caption className="text-danger" text="Email is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 mt-4">
        <TextInput
          title={"Current Password"}
          type="password"
          placeholder={"*********"}
          mode={theme.mode()}
          onChange={(e) => changeAttribute("currentPassword", e.target.value)}
          value={settings.currentPassword}
          className="w-100"
          required={true}
          error={validationErrors?.currentPassword}
        />
        {validationErrors?.currentPassword && (
          <Caption className="text-danger" text="Password doesn't match." />
        )}
      </div>
      <div className="d-flex flex-row w-100 mt-4">
        <TextInput
          title={"New Password"}
          type="password"
          placeholder={"*********"}
          mode={theme.mode()}
          onChange={(e) => changeAttribute("newPassword", e.target.value)}
          value={settings.newPassword}
          className="w-100"
          required={true}
          error={validationErrors?.newPassword}
        />
      </div>
      <div className="d-flex flex-wrap w-100">
        {tags.map((tag) => (
          <Tag
            className={`mr-2 mt-2${errors[tag] ? "" : " bg-success"}`}
            key={tag}
          >
            <P3 text={tag} bold className={errors[tag] ? "" : "text-white"} />
          </Tag>
        ))}
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={theme.mode()}
        disabled={cannotChangePassword()}
        className="mt-4 w-100"
      >
        Change password
      </Button>
      <Divider className="my-4" />
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <div className="d-flex flex-column w-100 flex-wrap">
          <H5
            className="w-100 text-left"
            mode={theme.mode()}
            text="Close Account"
            bold
          />
          <P2
            className="w-100 text-left"
            mode={theme.mode()}
            text="Delete your account and account data"
          />
          {settings.currentPassword && validationErrors?.deleting && (
            <P3
              className="w-100 text-left text-danger"
              text="Unabled to destroy user."
            />
          )}
        </div>
        <div>
          <Button
            onClick={() => deleteUser()}
            type="danger-default"
            disabled={!settings.currentPassword}
            mode={theme.mode()}
          >
            Delete Account
          </Button>
        </div>
      </div>
      <div className={"d-flex flex-row justify-content-start w-100 mt-4"}>
        <LoadingButton
          onClick={() => updateUser()}
          type="primary-default"
          mode={theme.mode()}
          disabled={saving.loading || cannotSaveSettings()}
          loading={saving.loading}
          success={saving.profile}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <EditSupporter {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};
