import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  Box,
} from "@material-ui/core";
import { search, setEventType, setIsLoggedIn } from "../../actions";

type Filter = {
  searchField: string;
  eventType: string;
  isLoggedIn: boolean;
};

interface RootState {
  navbar: Filter;
}

type NavBarProps = {
  showFull: boolean;
};

enum RedirectOptions {
  LOGIN,
  SIGNUP,
  LOGOUT,
}

const NavBar = ({ showFull }: NavBarProps) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = useState(false);
  const { searchField, eventType, isLoggedIn } = useSelector(
    (state: RootState) => state.navbar
  );
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setEventType(event.target.value as string));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search(event.target.value as string));
  };

  const handleRedirect = (redirectOption: RedirectOptions) => {
    switch (redirectOption) {
      case RedirectOptions.LOGIN:
        setRedirectToLogin(true);
        break;
      case RedirectOptions.SIGNUP:
        setRedirectToSignUp(true);
        break;
      case RedirectOptions.LOGOUT:
        handleLogout();
        break;
    }
  };

  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">ConcertsApp</Link>
        {showFull && (
          <InputBase
            placeholder="Search..."
            value={searchField}
            onChange={handleSearch}
          />
        )}
        {showFull && (
          <FormControl>
            <Select
              value={eventType}
              defaultValue={"All"}
              onChange={handleChange}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Concert"}>Concert</MenuItem>
              <MenuItem value={"Festival"}>Festival</MenuItem>
              <MenuItem value={"Museum"}>Museum</MenuItem>
            </Select>
            <FormHelperText>Set event type</FormHelperText>
          </FormControl>
        )}
        {!isLoggedIn ? (
          <Box>
            <Button variant="outlined" onClick={() => handleRedirect(RedirectOptions.LOGIN)}>
              Sign In
            </Button>
            <Button variant="outlined" onClick={() => handleRedirect(RedirectOptions.SIGNUP)}>
              Sign Up
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" onClick={() => handleRedirect(RedirectOptions.LOGOUT)}>
            Logout
          </Button>
        )}
        {redirectToLogin && <Redirect to={{pathname: "/login", state: {isSignUp: false}}} />}
        {redirectToSignUp && <Redirect to={{pathname: "/signup", state: {isSignUp: true}}} />}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
