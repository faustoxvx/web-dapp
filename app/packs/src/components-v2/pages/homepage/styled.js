import { desktopStyles } from "@talentprotocol/design-system";
import styled, { css } from "styled-components";

export const GMContainer = styled.div`
  max-width: 1128px;
  padding: 66px 0 0;
  margin: 0 auto;
`;

export const Container = styled.main`
  max-width: 1128px;
  margin: 0 auto;

  ${desktopStyles(css`
    display: flex;
    flex-direction: row;
    gap: 24px;
  `)}
`;

export const FullRow = styled.div`
  width: 100%;
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${desktopStyles(css`
    width: auto;
    display: flex;
    gap: 24px;
    ${({ grows }) => grows && "flex-grow: 1;"}
    min-width: 444px;
  `)}
`;
