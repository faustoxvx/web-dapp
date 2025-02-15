import React, { useCallback, useEffect, useState } from "react";
import { EmptyState } from "./empty-state";
import { QRCodeModal } from "../../talent-models-profile/profile-header/qr-code-modal";
import { Spinner, useModal } from "@talentprotocol/design-system";
import { InviteList } from "./invite-list";
import { invitedTalentsService } from "../../../../api";
import { SpinnerContainer } from "./styled";

export const Invites = ({ profile }) => {
  const [invitedTalentsState, setInvitedTalentsState] = useState({
    isLoading: true,
    talents: [],
    pagination: {
      total: 1,
      cursor: undefined
    }
  });
  const modalState = useModal();

  const fetchMore = useCallback(() => {
    invitedTalentsService
      .getInvitedTalents(5, invitedTalentsState.pagination.cursor)
      .then(({ data }) => {
        setInvitedTalentsState({
          isLoading: false,
          talents: [...invitedTalentsState.talents, ...data.talents],
          pagination: data.pagination
        });
      })
      .catch(err => {
        setInvitedTalentsState({ isLoading: false });
        console.error(err);
      });
  }, [invitedTalentsState]);

  useEffect(() => {
    fetchMore();
  }, []);

  return (
    <>
      {profile && <QRCodeModal modalState={modalState} profile={profile} />}
      {invitedTalentsState.isLoading && (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
      {!invitedTalentsState.talents.length && (
        <EmptyState openQRCodeModal={modalState.openModal} username={profile?.username} />
      )}
      {!!invitedTalentsState.talents.length && (
        <InviteList
          openQRCodeModal={modalState.openModal}
          username={profile?.username}
          list={invitedTalentsState.talents}
          totalInvites={invitedTalentsState.pagination.total}
          loadMore={invitedTalentsState.pagination.cursor && fetchMore}
        />
      )}
    </>
  );
};
