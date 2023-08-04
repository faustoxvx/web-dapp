import React from "react";
import { Button, Typography } from "@talentprotocol/design-system";
import Modal from "react-bootstrap/Modal";
import ThemedButton from "src/components/design_system/button";
import { useWindowDimensionsHook } from "src/utils/window";

export const DeleteConfirmationModal = ({ confirmDelete, cancelDelete, isOpen, resourceName }) => {
  const { mobile } = useWindowDimensionsHook();

  return (
    <Modal
      scrollable={true}
      show={isOpen}
      centered
      onHide={cancelDelete}
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background"}
      fullscreen={"md-down"}
    >
      <Modal.Body className="show-grid pt-6 pb-0 px-4">
        <Typography specs={{ variant: "h4", type: "bold" }} color="primary03">
          Are you sure you want to delete this {resourceName}?
        </Typography>
      </Modal.Body>
      <Modal.Footer className="ml-auto px-6 py-3" style={{ borderTop: "none" }}>
        <Button hierarchy="tertiary" text="Cancel" onClick={cancelDelete} size="small" />
        <ThemedButton type="danger-outline" className="mr-auto cursor-pointer" text="Delete" onClick={confirmDelete} />
      </Modal.Footer>
    </Modal>
  );
};
