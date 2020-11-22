import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar";

interface IURLId {
  id: string;
}

const EventPage = (props: any) => {
  const { id } = useParams<IURLId>();
  const {imageURL, dateOfEvent, longDescription, nameOfEvent, place, ticketPrice} = props.location.state;
  const [redirectToForm, setRedirectToForm] = useState(false);
  const handleClick = () => {
    setRedirectToForm(true);
  };
  return (
    <>
      <NavBar showFull={false} />
      <h1>{nameOfEvent}</h1>
      <img src={`http://localhost:5000${imageURL}`} alt="" />
      <Typography variant="h4" component="h2">
            {nameOfEvent}
          </Typography>
          <Typography variant="h6" component="h3">
            {place}
          </Typography>
          <Typography variant="h6" component="h3">
            {dateOfEvent}
          </Typography>
          <Typography variant="body2" component="p">
            {longDescription}
          </Typography>
          <Typography variant="body2" component="p">
            {ticketPrice / 100} zł
          </Typography>
      <button onClick={handleClick}>Buy ticket!</button>
      {redirectToForm && <Redirect to={`/event/${id}/form`} />}
    </>
  );
};

export default EventPage;
