import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Box,
  TextField,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { search, setEventType, setIsLoggedIn } from "../../actions";
import NavBarButton from "./NavBarButton/NavBarButton";

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
  PURCHASE_HISTORY,
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  select: {
    flex: 1,
    margin: "0.5rem 0.5rem 0 0.5rem",
    minWidth: 140,
    maxHeight: 50,
    color: "white",
    "&:before": {
      borderColor: "white",
    },
    "&:after": {
      borderColor: "white",
    },
  },
  white: {
    color: "white",
    fill: "white",
  },
  link: {
    color: "white",
    fontSize: "1.6rem",
    textDecoration: "none",
  },
  searchField: {
    margin: "auto 0.5rem",
    borderColor: "white",
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
});

const NavBar = ({ showFull }: NavBarProps) => {
  //Redirect state
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [redirectToPurchaseHis, setRedirectToPurchaseHis] = useState(false);
  //Redux selector
  const { searchField, eventType, isLoggedIn } = useSelector(
    (state: RootState) => state.navbar
  );
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setEventType(event.target.value as string));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search(event.target.value as string));
  };

  const handleRedirect = async (redirectOption: RedirectOptions) => {
    switch (redirectOption) {
      case RedirectOptions.LOGIN:
        setRedirectToLogin(true);
        setRedirectToSignUp(false);
        break;
      case RedirectOptions.SIGNUP:
        setRedirectToSignUp(true);
        setRedirectToLogin(false);
        break;
      case RedirectOptions.LOGOUT:
        await handleLogout();
        break;
      case RedirectOptions.PURCHASE_HISTORY:
        setRedirectToPurchaseHis(true);
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`/api/logout`);
      setRedirectToHome(true);
      dispatch(setIsLoggedIn(false));
    } catch (err) {
      console.log("error has occured");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.container}>
        <Link to="/" className={classes.link}>
          ConcertsApp
        </Link>
        {showFull && (
          <TextField
            placeholder="Search..."
            variant="outlined"
            value={searchField}
            onChange={handleSearch}
            className={classes.searchField}
          />
        )}
        {showFull && (
          <FormControl>
            <Select
              value={eventType}
              defaultValue={"All"}
              className={classes.select}
              onChange={handleChange}
              inputProps={{
                classes: {
                  icon: classes.white,
                },
              }}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Concert"}>Concert</MenuItem>
              <MenuItem value={"Festival"}>Festival</MenuItem>
              <MenuItem value={"Museum"}>Museum</MenuItem>
            </Select>
            <FormHelperText className={classes.white}>
              Set event type
            </FormHelperText>
          </FormControl>
        )}
        {!isLoggedIn ? (
          <Box>
            <NavBarButton onClick={() => handleRedirect(RedirectOptions.LOGIN)}>
              Sign In
            </NavBarButton>
            <NavBarButton
              onClick={() => handleRedirect(RedirectOptions.SIGNUP)}
            >
              Sign Up
            </NavBarButton>
          </Box>
        ) : (
          <Box>
            <NavBarButton
              onClick={() => handleRedirect(RedirectOptions.PURCHASE_HISTORY)}
            >
              Purchase History
            </NavBarButton>
            <NavBarButton
              onClick={() => handleRedirect(RedirectOptions.LOGOUT)}
            >
              Logout
            </NavBarButton>
          </Box>
        )}

        {redirectToLogin && (
          <Redirect to={{ pathname: "/login", state: { isSignUp: false } }} />
        )}
        {redirectToSignUp && (
          <Redirect to={{ pathname: "/signup", state: { isSignUp: true } }} />
        )}
        {redirectToHome && <Redirect to="/" />}
        {redirectToPurchaseHis && <Redirect to="/purchase_history" />}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
