import React, { useMemo } from "react";
import { Button, Modal } from "@talentprotocol/design-system";
import { Container, ModalFooter, InLineTextWithComponents } from "./styled";
import ThemedButton from "src/components/design_system/button";

export const DeleteConfirmationModal = ({ confirmDelete, cancelDelete, isOpen, resourceName }) => {
  const modalFooter = useMemo(
    () => (
      <ModalFooter>
        <ThemedButton type="danger-outline" className="mr-auto cursor-pointer" text="Delete" onClick={confirmDelete} />
        <Button hierarchy="tertiary" text="Cancel" onClick={cancelDelete} size="small" />
      </ModalFooter>
    ),
    [confirmDelete, cancelDelete]
  );

  return (
    <Modal title={resourceName} isOpen={isOpen} closeModal={cancelDelete} footer={modalFooter}>
      <Container>
        <InLineTextWithComponents specs={{ variant: "h4", type: "regular" }} color="primary03">
          Are you sure you want to delete this {resourceName}?
        </InLineTextWithComponents>
      </Container>
    </Modal>
  );
};
