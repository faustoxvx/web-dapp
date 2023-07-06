import React, { useEffect, useMemo, useState } from "react";
import { ModalDialog, Typography, useModal } from "@talentprotocol/design-system";
import { useStepExperience } from "../../hooks/use-step-experience";
import { EmailPasswordStep } from "./steps/email-password";
import { WelcomeStep } from "./steps/welcome";
import { LegalNameStep } from "./steps/legal-name";
import { HandleStep } from "./steps/handle";
import { DefineStep } from "./steps/define";
import { OccupationStep } from "./steps/occupation";
import { LookingForStep } from "./steps/looking-for";
import { IntroductionStep } from "./steps/introduction";
import { ConfirmEmailStep } from "./steps/confirm-email";
import { useUserBuilder } from "./hooks/use-user-builder";
import { WelcomeFooter } from "./welcome-footer";
import { CreateAccountFooter } from "./create-account-footer";
import { DefaultFooter } from "./default-footer";
import { ActionContainer, Container, StepContainer, StepCounterContainer } from "./styled";
import { EmailFooter } from "./email-footer";
import { Captcha } from "./steps/captcha";

const STEP_TO_COMPONENT_MAP = {
  1: {
    component: WelcomeStep,
    path: "welcome"
  },
  2: {
    component: EmailPasswordStep,
    path: "email_password"
  },
  3: {
    component: LegalNameStep,
    path: "legal_names"
  },
  4: {
    component: HandleStep,
    path: "handle"
  },
  5: {
    component: DefineStep,
    path: "define"
  },
  6: {
    component: OccupationStep,
    path: "occupation"
  },
  7: {
    component: LookingForStep,
    path: "looking_for"
  },
  8: {
    component: IntroductionStep,
    path: "introduction"
  },
  9: {
    component: ConfirmEmailStep,
    path: "confirm_email"
  }
};

const CAN_SKIP_STEPS = [5, 6, 7];

export const SignUpFlow = props => {
  const captchaModalState = useModal();
  const { linkedinClientId, linkedinRedirectUri } = props.railsContext;
  const [isNextDisabled, setIsNextDisable] = useState(true);
  const [hasCreateAccountError, setHasCreateAccountError] = useState(false);
  const [createdUser, setCreatedUser] = useState({});
  const userBuilderState = useUserBuilder();

  useEffect(() => {
    // Used for linkedin signups
    document.cookie = `utm_source=${props.utmSource};path=/`;
    document.cookie = `invite_code=${props.code};path=/`;
  }, [props.code, props.utmSource]);

  useEffect(() => {
    if (props.code == userBuilderState.user.code && props.utmSource == userBuilderState.user.utmSource) return;
    userBuilderState.setUser({
      ...userBuilderState.user,
      code: props.code,
      utmSource: props.utmSource
    });
  }, [props.code, props.utmSource, userBuilderState]);
  const stepsState = useStepExperience(Object.keys(STEP_TO_COMPONENT_MAP).length);
  const StepScreen = useMemo(() => STEP_TO_COMPONENT_MAP[stepsState.currentStep].component, [stepsState.currentStep]);
  useEffect(() => {
    setIsNextDisable(true);
  }, [setIsNextDisable, stepsState.currentStep]);

  useEffect(() => {
    const url = new URL(document.location);
    const stepPath = STEP_TO_COMPONENT_MAP[stepsState.currentStep].path;
    const urlWithPath = `${url.origin}/join/${stepPath}`;
    window.history.pushState({}, document.title, urlWithPath);
  }, [stepsState.currentStep]);

  useEffect(() => {
    const handleBrowserBackButton = () => {
      stepsState.previousStep();
    };
    window.addEventListener('popstate', handleBrowserBackButton);
    return () => {
      window.removeEventListener('popstate', handleBrowserBackButton);
    };
  }, [stepsState]);

  const MemoizedStep = useMemo(
    () => (
      <StepScreen
        openCaptchaModal={captchaModalState.openModal}
        nextStep={stepsState.nextStep}
        setIsNextDisable={setIsNextDisable}
        isNextDisabled={isNextDisabled}
        user={userBuilderState.user}
        setUser={userBuilderState.setUser}
        linkedinClientId={linkedinClientId}
        linkedinRedirectUri={linkedinRedirectUri}
        setHasCreateAccountError={setHasCreateAccountError}
        setCreatedUser={setCreatedUser}
        inviteProps={{
          name: props.name,
          profilePictureUrl: props.profilePictureUrl,
          inviteCode: props.inviteCode
        }}
        goToFirstStep={() => stepsState.jumpToStep(props.isDesktop ? 2 : 3)}
      />
    ),
    [
      captchaModalState,
      stepsState,
      setIsNextDisable,
      isNextDisabled,
      useUserBuilder,
      linkedinClientId,
      linkedinRedirectUri,
      props.name,
      props.profilePictureUrl,
      props.inviteCode,
      props.isDesktop
    ]
  );
  const MemoizedDefaultFooter = useMemo(
    () => (
      <DefaultFooter
        showSkipButton={CAN_SKIP_STEPS.includes(stepsState.currentStep)}
        previousStep={stepsState.previousStep}
        nextStep={stepsState.nextStep}
        isNextDisabled={isNextDisabled}
      />
    ),
    [stepsState, isNextDisabled, props.isDesktop]
  );
  const MemoizedActionArea = useMemo(() => {
    switch (stepsState.currentStep) {
      case 1:
        return <WelcomeFooter />
      case 2:
        return MemoizedDefaultFooter;
      case 8:
        return (
          <CreateAccountFooter
            previousStep={stepsState.previousStep}
            openCaptchaModal={captchaModalState.openModal}
            isNextDisabled={isNextDisabled}
          />
        );
      case 9:
        return <EmailFooter hasCreateAccountError={hasCreateAccountError} createdUser={createdUser} />;
      default:
        return MemoizedDefaultFooter;
    }
  }, [stepsState.currentStep, isNextDisabled, props.isDesktop, hasCreateAccountError, createdUser]);
  return (
    <>
      <ModalDialog title="Captcha" isOpen={captchaModalState.isOpen} closeModal={captchaModalState.closeModal}>
        <Captcha
          captchaKey={props.railsContext.captchaKey}
          nextStep={stepsState.nextStep}
          user={userBuilderState.user}
          setUser={userBuilderState.setUser}
          closeModal={captchaModalState.closeModal}
        />
      </ModalDialog>
      <Container>
        {stepsState.currentStep === 10 || stepsState.currentStep === 9 ? (
          <></>
        ) : (
          <StepCounterContainer>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary01">
              Step {stepsState.currentStep}
            </Typography>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary03">
              /
            </Typography>
            <Typography specs={{ variant: "p2", type: "medium" }} color="primary04">
              9
            </Typography>
          </StepCounterContainer>
        )}
        <StepContainer>{MemoizedStep}</StepContainer>
      </Container>
      <ActionContainer>{MemoizedActionArea}</ActionContainer>
    </>
  );
};
