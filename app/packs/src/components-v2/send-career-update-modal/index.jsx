import { Button, Modal, Pills, TextArea, TextLink, Typography } from "@talentprotocol/design-system";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, ModalFooter, InLineTextWithComponents, EntryContainer, PillsContainer } from "./styled";
import { toast } from "react-toastify";
import { careerUpdatesService } from "../../api";
import { ToastBody } from "src/components/design_system/toasts";
import ThemedButton from "src/components/design_system/button";

const bootstrapGoals = goals => () =>
  goals.map(goal => ({ content: goal.title, isSelected: false, isDisabled: false, id: goal.id }));

export const SendCareerUpdateModalV2 = ({
  isOpen,
  closeModal,
  profile,
  isCurrentUserProfile,
  updateToEdit,
  closeEditUpdateModal
}) => {
  const textAreaRef = React.useRef(null);
  const [pills, setPills] = useState(bootstrapGoals(profile.goals));

  console.log("=======>", updateToEdit);

  useEffect(() => {
    if (isOpen) {
      setPills(bootstrapGoals(profile.goals));
    }
  }, [isOpen]);

  const sendCareerUpdate = useCallback(() => {
    const message = textAreaRef.current.value;
    if (message.replace(/\s+/g, "") == "") {
      return;
    }
    const selectedPills = pills.reduce((acc, pill) => {
      if (pill.isSelected) {
        acc.push({ id: pill.id });
      }
      return acc;
    }, []);
    careerUpdatesService
      .sendUpdate(message, selectedPills)
      .then(() => {
        toast.success(
          <ToastBody heading="Success!" body={"Your career update was created and sent to your supporters."} />,
          { autoClose: 3000 }
        );
        closeModal();
      })
      .catch(error => {
        console.error(error);
        toast.error(<ToastBody heading="Error!" />, { autoClose: 3000 });
      });
  }, [textAreaRef, pills, closeModal]);
  const modalFooter = useMemo(
    () => (
      <ModalFooter>
        {isCurrentUserProfile && updateToEdit !== undefined ? (
          <>
            <ThemedButton
              type="danger-outline"
              className="mr-auto cursor-pointer"
              text="Delete Update"
              onClick={() => console.log("click")}
            />
            <Button hierarchy="tertiary" text="Cancel" onClick={closeEditUpdateModal} size="small" />
            <Button hierarchy="primary" text="Edit Update" onClick={sendCareerUpdate} size="small" />
          </>
        ) : (
          <>
            <Button hierarchy="tertiary" text="Cancel" onClick={closeModal} size="small" />
            <Button hierarchy="primary" text="Send Update" onClick={sendCareerUpdate} size="small" />
          </>
        )}
      </ModalFooter>
    ),
    [closeModal, isCurrentUserProfile, sendCareerUpdate]
  );
  const handlePillClick = useCallback(
    index => {
      const newPills = [...pills];
      newPills[index].isSelected = !newPills[index].isSelected;
      setPills(newPills);
    },
    [pills]
  );
  return (
    <Modal title="Career update" isOpen={isOpen} closeModal={closeEditUpdateModal} footer={modalFooter}>
      <Container>
        <InLineTextWithComponents specs={{ variant: "p2", type: "regular" }} color="primary03">
          Think of this updates more as an intimate career log, and less like posting on social media or broadcasting to
          an audience. Need help to write it? Check some tips
          <TextLink
            color="primary"
            text="here."
            size="small"
            href="https://blog.talentprotocol.com/supporter-updates-guide/"
            newPage
          />
        </InLineTextWithComponents>
        <EntryContainer>
          <TextArea placeholder={`What's new in your career, ${profile?.name}?`} textAreaRef={textAreaRef} />
          <InLineTextWithComponents specs={{ variant: "p2", type: "regular" }} color="primary04">
            Do you need help writing your career update? Ask our community on
            <TextLink color="primary" text="Discord." size="small" href="https://discord.gg/talentprotocol" />
          </InLineTextWithComponents>
        </EntryContainer>
        <PillsContainer>
          <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
            Tag your goals
          </Typography>
          {!!pills.length ? (
            <Pills pillList={pills} onClick={handlePillClick} />
          ) : (
            <EntryContainer>
              <InLineTextWithComponents specs={{ variant: "p2", type: "regular" }} color="primary04">
                Updates are even more useful if associated with goals. Create your first goal
                <TextLink color="primary" text="here." size="small" href={`/u/${profile.username}`} />
              </InLineTextWithComponents>
            </EntryContainer>
          )}
        </PillsContainer>
      </Container>
    </Modal>
  );
};
