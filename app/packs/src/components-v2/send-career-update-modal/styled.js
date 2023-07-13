import { Typography, desktopStyles } from "@talentprotocol/design-system";
import styled, { css } from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  gap: 24px;
  text-align: left;
  max-width: 100%;
  overflow: hidden;
`;

export const InLineTextWithComponents = styled(Typography)`
  max-width: 100%;
  white-space: pre-line;

  span {
    display: inline;
  }

  a {
    display: inline;
    label {
      display: inline;
      margin-left: 3px;
    }
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  padding: 0 16px;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px 0;
`;

export const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;

  > :nth-child(1) {
    margin-bottom: 10px;

    textarea {
      height: 180px;
    }
  }
`;

export const PillsContainer = styled.div`
  > :nth-child(1) {
    margin-bottom: 8px;
  }

  > :nth-child(2) {
    div {
      display: flex;
      align-items: center;

      label {
        max-width: 250px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        ${desktopStyles(css`
          max-width: 500px;
        `)}
      }
    }
  }
`;
