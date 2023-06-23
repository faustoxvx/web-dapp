import { Dropdown, Input, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { genderOptions, nationalityOptions } from "../../../../components/talent/Edit/dropdownValues";
import { TitleRow, Row, RowWithMargin, Form } from "./styled";
import Select from "react-select";

export const DefineStep = ({ user, setUser, setIsNextDisable }) => {
  const [gender, setGender] = useState({ value: user.gender || "" });
  const [nationality, setNationality] = useState({ value: user.nationality || "" });
  const locationRef = useRef(null);
  const validateStep = useCallback(
    (genderParameter, nationalityParameter) => {
      let newOptions = {};

      if (!!genderParameter) {
        newOptions = {
          ...newOptions,
          gender: genderParameter?.value || gender?.value
        };
      }

      if (!!nationalityParameter) {
        newOptions = {
          ...newOptions,
          nationality: nationalityParameter?.value || nationality?.value
        };
      }

      if (locationRef.current.value !== user.location) {
        newOptions = {
          ...newOptions,
          location: locationRef.current.value
        };
      }

      setUser({
        ...user,
        ...newOptions
      });

      if (gender !== "" && nationality !== "" && locationRef.current.value !== "") {
        setIsNextDisable(false);
      } else {
        setIsNextDisable(true);
      }
    },
    [gender, nationality, locationRef, user, setUser]
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
            Location
          </Typography>
          <Input
            placeholder="City you currently live in"
            onChange={validateStep}
            onBlur={validateStep}
            inputRef={locationRef}
            defaultValue={user.location}
          />
        </RowWithMargin>
      </Form>
    </>
  );
};
