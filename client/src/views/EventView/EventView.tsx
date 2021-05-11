import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import axios from "axios";
import { Typography, makeStyles, Button } from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar";

interface IURLId {
  id: string;
}

const useStyles = makeStyles({
  center: {
    margin: "auto",
    textAlign: "center",
  },
  centerWrap: {
    margin: "auto",
    textAlign: "center",
    flexWrap: "wrap",
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const EventView = (props: any) => {
  const { id } = useParams<IURLId>();
  const classes = useStyles();
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
  const backgroundStyle = {
    display: "flex",
    width: "40vw",
    height: "65vh",
    color: "white",
    backgroundImage: `url(http://localhost:5000${imageURL})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <>
      <NavBar showFull={false} />
      <div className={classes.center}>
        <div style={backgroundStyle} className={classes.center}>
          <Typography variant="h1" component="h1" className={classes.centerWrap}>
            {nameOfEvent}
          </Typography>
        </div>
        <div className={classes.container}>
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
            <Button variant="outlined" onClick={handleClick} fullWidth={false}>Buy ticket!</Button>
          ) : (
            <Typography variant="body2" component="p">
              No tickets left!
            </Typography>
          )}
        </div>

        {errorOccurred && <Redirect to={`/error`} />}
        {redirectToForm && <Redirect to={`/event/${id}/form`} />}
      </div>
    </>
  );
};

export default EventView;
