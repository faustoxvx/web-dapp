import { Spinner, Typography, useModal } from "@talentprotocol/design-system";
import React, { useEffect, useMemo, useState } from "react";
import { useTalentCareerUpdatesFetcher } from "../../../../hooks/use-talent-career-updates-fetcher";
import { CareerUpdateEmptyState } from "./empty-state";
import { Container, InputContainer, TitleContainer } from "./styled";
import { CareerUpdate } from "../../../career-update";
import { CareerUpdateLockedState } from "./locked-state";
import TextInput from "src/components/design_system/fields/textinput";
import { SendCareerUpdateModalV2 } from "../../../send-career-update-modal";

export const CareerUpdates = ({ profile, currentUserProfile, isCurrentUserProfile, railsContext, setProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { careerUpdates, fetchCareerUpdates } = useTalentCareerUpdatesFetcher();
  const [updateToEdit, setUpdateToEdit] = useState();

  const closeEditUpdateModal = () => {
    if (updateToEdit !== undefined) {
      setUpdateToEdit(undefined);
      sendCareerUpdateModalState.closeModal();
    } else {
      sendCareerUpdateModalState.closeModal();
    }
  };

  const sendCareerUpdateModalState = useModal();
  useEffect(() => {
    fetchCareerUpdates(profile.user.username)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLocked(true);
        setIsLoading(false);
      });
  }, [fetchCareerUpdates, profile]);
  const RenderedContent = useMemo(() => {
    if (isLocked) {
      return <CareerUpdateLockedState profile={profile} setProfile={setProfile} />;
    }
    if (!careerUpdates.length) {
      return (
        <CareerUpdateEmptyState
          isCurrentUserProfile={isCurrentUserProfile}
          contractsEnv={railsContext}
          currentUserProfile={currentUserProfile}
          profile={profile}
          setUpdateToEdit={setUpdateToEdit}
        />
      );
    }
    return (
      <>
        <TitleContainer>
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
            {profile.user.name}'s career updates
          </Typography>
        </TitleContainer>

        {isCurrentUserProfile && (
          <SendCareerUpdateModalV2
            isOpen={sendCareerUpdateModalState.isOpen}
            closeModal={sendCareerUpdateModalState.closeModal}
            profile={currentUserProfile}
            isCurrentUserProfile={isCurrentUserProfile}
            updateToEdit={updateToEdit}
            setUpdateToEdit={setUpdateToEdit}
            closeEditUpdateModal={closeEditUpdateModal}
          />
        )}
        <InputContainer>
          {isCurrentUserProfile && (
            <TextInput
              placeholder={`What's new in your career ${profile.user.name}?`}
              onClick={sendCareerUpdateModalState.openModal}
              className="w-100"
            />
          )}
        </InputContainer>
        {careerUpdates.map(update => (
          <CareerUpdate
            key={update.created_at}
            data={update}
            profile={profile}
            isCurrentUserProfile={isCurrentUserProfile}
            sendCareerUpdateModalState={sendCareerUpdateModalState}
            setUpdateToEdit={setUpdateToEdit}
          />
        ))}
      </>
    );
  }, [
    careerUpdates,
    profile,
    isLocked,
    sendCareerUpdateModalState,
    railsContext,
    isCurrentUserProfile,
    setProfile,
    currentUserProfile,
    closeEditUpdateModal
  ]);
  return <Container>{isLoading ? <Spinner /> : RenderedContent}</Container>;
};
