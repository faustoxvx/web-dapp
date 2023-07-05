import { Dropdown, Input, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { genderOptions, locationOptions, nationalityOptions } from "../../../../components/talent/Edit/dropdownValues";
import { TitleRow, Row, RowWithMargin, Form } from "./styled";
import Select from "react-select";

export const DefineStep = ({ user, setUser, setIsNextDisable }) => {
  const [gender, setGender] = useState({ value: user.gender || "" });
  const [nationality, setNationality] = useState({ value: user.nationality || "" });
  const [locationError, setLocationError] = useState("");
  const locationRef = useRef(null);
  const validateStep = useCallback(
    (genderParameter, nationalityParameter) => {
      if (locationRef.current.value?.match(/[^a-zA-Z\s]/)) {
        setLocationError("Please enter a valid location");
        return;
      } else {
        setLocationError("");
      }
      if ((!!genderParameter || !!gender) && (!!nationalityParameter || !!nationality)) {
        setUser({
          ...user,
          gender: gender?.value || genderParameter,
          nationality: nationality?.value || nationalityParameter,
          location: locationRef.current.value
        });
        setIsNextDisable(false);
      } else {
        setIsNextDisable(true);
      }
    },
    [gender, nationality, locationRef, user, setUser, setLocationError]
  );
  useEffect(() => {
    requestAnimationFrame(() => {
      validateStep();
    });
  }, []);
  return (
    <>
      <TitleRow>
        <Typography specs={{ variant: "h3", type: "bold" }} color="primary01">
          What best defines you?
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          Only Location will be visible in your profile.
        </Typography>
      </TitleRow>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Gender
          </Typography>
          <Dropdown
            options={genderOptions.map(option => ({
              value: option
            }))}
            selectOption={value => {
              setGender(value);
              validateStep(value);
            }}
            selectedOption={gender || user.gender || ""}
            placeholder="Select a gender"
          />
        </Row>
        <RowWithMargin>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Nationality
          </Typography>
          <Select
            classNamePrefix="select"
            value={{
              value: nationality?.value || user.nationality || "",
              label: nationality?.value || user.nationality || ""
            }}
            isClearable={true}
            isSearchable={true}
            placeholder="Select a nationality"
            name="nationality"
            options={nationalityOptions.map(option => ({
              value: option,
              label: option
            }))}
            onChange={option => {
              setNationality(option);
              validateStep(undefined, option);
            }}
          />
        </RowWithMargin>
        <RowWithMargin>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            City you currently live in
          </Typography>
          <Select
            classNamePrefix="select"
            value={{
              value: location?.value || user.location || "",
              label: location?.value || user.location || ""
            }}
            isClearable={true}
            isSearchable={true}
            placeholder="Enter your current location"
            name="location"
            options={locationOptions.map(option => ({
              value: option,
              label: option
            }))}
               inputRef={locationRef}
               defaultValue={user.location}
               hasError={!!locationError}
               shortDescription={locationError}
            onChange={option => {
              setLocation(option);
              validateStep(undefined, option);
            }}
          />
         
        </RowWithMargin>
      </Form>
    </>
  );
};
