import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import NavBar from "../../components/NavBar/NavBar";

const LoginView = (props: any) => {
  const [isFilled, setIsFilled] = useState(false);
  const { isSignUp } = props.location.state;
  return (
    <>
      <NavBar showFull={false} />
      <TextField
        variant="outlined"
        required
        id="login"
        label="Login"
        autoComplete="off"
      />
      <TextField
        variant="outlined"
        required
        id="password"
        label="Password"
        autoComplete="off"
      />
      {isSignUp ? (
        <Box component="span">
          <TextField
            variant="outlined"
            required
            id="first_name"
            label="First Name"
            autoComplete="off"
          />
          <TextField
            variant="outlined"
            required
            id="last_name"
            label="Last Name"
            autoComplete="off"
          />
          <TextField
            variant="outlined"
            required
            id="phone_number"
            label="Phone numbers"
            autoComplete="off"
          />
          <Button disabled={!isFilled}>Sign Up</Button>
        </Box>
      ) : (
        <Button disabled={!isFilled}>Log In</Button>
      )}
    </>
  );
};

export default LoginView;
