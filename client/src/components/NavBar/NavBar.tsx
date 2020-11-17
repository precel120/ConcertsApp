import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { search, setEventType } from "../../actions";

type Filter = {
  searchField: string;
  eventType: string;
};

interface RootState {
  navbar: Filter;
}

const NavBar = () => {
  const helperFunc = (state: RootState) => {
    return state.navbar;
  };
  const { searchField, eventType } = useSelector(helperFunc);
  const dispatch = useDispatch();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setEventType(event.target.value as string));
  };
  // TODO last letter is cut AGAIN
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search(event.target.value as string));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">ConcertsApp</Link>
        <InputBase
          placeholder="Search..."
          value={searchField}
          onChange={handleSearch}
        />
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
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
