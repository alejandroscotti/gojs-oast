import styled from "@emotion/styled";
import { AppBar } from "@mui/material";

export const Drawer = styled.div`
  display: block;
  background: #f5f5f5ca;
`;

export const DrawerContainer = styled.div`
  display: "flex";
  flex-direction: column;
  width: 20rem;
  height: 100%;
  border-radius: 5px;
`;

export const AppBarStyled = styled(AppBar)<{ grid?: boolean }>`
  padding: 0px 1.5rem;
  height: 3rem;
  position: relative;
  border-radius: 5px 5px 0px 0px;
  width: 100%;
  display: ${({ grid }) => (grid ? "grid" : "flex")};
  flex-direction: row;
  justify-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
`;

export const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
