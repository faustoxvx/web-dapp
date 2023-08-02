import { Typography } from "@talentprotocol/design-system";
import styled from "styled-components";

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

  textarea {
    height: 180px;
  }

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
