import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import axios from "axios";
import { Typography } from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar";

interface IURLId {
  id: string;
}

const EventView = (props: any) => {
  const { id } = useParams<IURLId>();
  const {
    imageURL,
    dateOfEvent,
    longDescription,
    nameOfEvent,
    place,
    ticketPrice,
  } = props.location.state;
  const [redirectToForm, setRedirectToForm] = useState(false);
  const [ticketsLeftClient, setTicketsLeftClient] = useState(0);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const handleClick = () => {
    setRedirectToForm(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const temp = await axios.get(`/api/events/${id}`);
      const { status, data } = temp;
      const { ticketsLeft } = data;
      if (status === 200) {
        setTicketsLeftClient(ticketsLeft);
      } else throw new Error("Something went wrong :/");
    };
    try {
      fetchData();
    } catch (err) {
      setErrorOccurred(true);
    }
  }, [dateOfEvent, id, setTicketsLeftClient]);

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
        {dateOfEvent.toLocaleDateString()}
      </Typography>
      <Typography variant="body2" component="p">
        {longDescription}
      </Typography>
      <Typography variant="body2" component="p">
        {ticketPrice / 100} zł
      </Typography>
      <Typography variant="body2" component="p">
        Tickets left: {ticketsLeftClient}
      </Typography>
      {ticketsLeftClient > 0 ? (
        <button onClick={handleClick}>Buy ticket!</button>
      ) : (
        <Typography variant="body2" component="p">
          No tickets left!
        </Typography>
      )}
      {errorOccurred && <Redirect to={`/error`} />}
      {redirectToForm && <Redirect to={`/event/${id}/form`} />}
    </>
  );
};

export default EventView;
