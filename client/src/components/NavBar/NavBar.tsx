import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

type NavBarProps = {
    temp: Function;
}

const NavBar = ({temp}: NavBarProps) => {
  const [eventType, setEventType] = useState("All");
  const [searchPhrase, setSearchPhrase] = useState("");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEventType(event.target.value as string);
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(event.target.value as string);
  };
  const temp2 = useCallback(() => temp(searchPhrase, eventType), [searchPhrase, eventType]);
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">ConcertsApp</Link>
        <InputBase
          placeholder="Search..."
          value={searchPhrase}
          onChange={handleSearch}
        />
        <FormControl>
          <Select value={eventType} onChange={handleChange}>
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
