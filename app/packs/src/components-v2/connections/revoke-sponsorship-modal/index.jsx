import React, { useCallback, useMemo } from "react";
import { TransactionStep } from "./steps/transaction";
import { useStepExperience } from "../../../hooks/use-step-experience";
import { Modal } from "@talentprotocol/design-system";
import { SuccessStep } from "./steps/success";

const STEPS = {
  1: TransactionStep,
  2: SuccessStep
};

export const RevokeSponsorshipModal = ({ modalState, sponsorship, railsContext, removePendingSponsorship }) => {
  const stepsState = useStepExperience(Object.keys(STEPS).length);
  const StepScreen = useMemo(() => STEPS[stepsState.currentStep], [stepsState.currentStep]);
  const closeModal = useCallback(() => {
    modalState.closeModal();
    stepsState.jumpToStep(1);
  }, [modalState.closeModal, stepsState.jumpToStep]);

  return (
    <Modal title="Cancel sponsorship?" isOpen={modalState.isOpen} closeModal={closeModal}>
      {
        <StepScreen
          sponsorship={sponsorship}
          railsContext={railsContext}
          closeModal={closeModal}
          nextStep={stepsState.nextStep}
          removePendingSponsorship={removePendingSponsorship}
        />
      }
    </Modal>
  );
};
