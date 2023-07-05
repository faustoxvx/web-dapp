import { Button, Icon, Spinner, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { users } from "../../../../api";
import { Container, TitleRow } from "./styled";

export const ConfirmEmailStep = ({ user, goToFirstStep, setHasCreateAccountError, setCreatedUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const createAccountCallback = useCallback(() => {
    users
      .createAccount(user)
      .then(({ data }) => {
        setIsLoading(false);
        setHasError(false);
        setHasCreateAccountError(false);
        setCreatedUser(data);
      })
      .catch(e => {
        setError(e.response.data);
        setIsLoading(false);
        setHasError(true);
        setHasCreateAccountError(true);
      });
  }, [user, setHasCreateAccountError]);

  useEffect(() => {
    createAccountCallback();
  }, [createAccountCallback]);

  const ErrorTitle = () => {
    if (!hasError) {
      return;
    }

    if (error.field === "username") {
      return "Username Unavailable";
    } else if (error.field === "email") {
      return "Email Already In Use";
    } else if (error.field === "captcha") {
      return "Captcha Error";
    } else {
      return "Something went wrong";
    }
  };

  const errorText = () => {
    if (!hasError) {
      return;
    }

    if (error.field === "username") {
      return "The username you've selected is already taken. Please choose a different one to proceed.";
    } else if (error.field === "email") {
      return "The email address you entered is already registered in our system. Please use a different email to sign up or log in with the existing account.";
    } else if (error.field === "captcha") {
      return "We were unable to validate the captcha or it may have expired, please try again.";
    } else {
      return "An unexpected error has occurred. Please try again later or contact our support team if the issue persists.";
    }
  };

  return isLoading ? (
    <Container>
      <Spinner size={64} />
    </Container>
  ) : (
    (hasError && (
      <Container>
        <Icon name="question" color="primary04" size={64} />
        <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
          {ErrorTitle()}
        </Typography>
        <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
          {errorText()}
        </Typography>
        <Button hierarchy="primary" size="medium" text="Review data" onClick={goToFirstStep} />
      </Container>
    )) || (
      <Container>
        <TitleRow>
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
          Please go to your inbox to confirm your email address. Check your spam folder if you can't find the email.
          </Typography>
          <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
            {user.email}
          </Typography>
        </TitleRow>
      </Container>
    )
  );
};
