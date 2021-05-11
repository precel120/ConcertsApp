import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    margin: "5px",
  },
});

type NavBarButtonProps = {
  onClick: Function;
  children: React.ReactNode;
};

const NavBarButton = ({ onClick, children }: NavBarButtonProps) => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      className={classes.button}
      onClick={() => onClick()}
    >
      {children}
    </Button>
  );
};

export default NavBarButton;
