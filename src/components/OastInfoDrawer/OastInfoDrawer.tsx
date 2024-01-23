import {
  AppBarStyled,
  Drawer,
  DrawerContainer,
  DrawerContent,
} from "./OastInfoDrawerStyles";

const OastInfoDrawer = (props: any) => {
  const { headerContent, bodyContent } = props;

  return (
    <Drawer>
      <DrawerContainer>
        <AppBarStyled
          enableColorOnDark={true}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {headerContent}
        </AppBarStyled>
        <DrawerContent>{bodyContent}</DrawerContent>
      </DrawerContainer>
    </Drawer>
  );
};

export default OastInfoDrawer;
