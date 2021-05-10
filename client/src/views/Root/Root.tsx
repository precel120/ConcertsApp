import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import EventCard from "../../components/EventCard/EventCard";
import NavBar from "../../components/NavBar/NavBar";
import { Typography, makeStyles } from "@material-ui/core";

type Event = {
  _id: string;
  imageUrl: string;
  nameOfEvent: string;
  dateOfEvent: Date;
  place: string;
  description: string;
  longDescription: string;
  type: string;
  maxTicketsAmount: number;
  ticketPrice: number;
};

type Filter = {
  searchPhrase: string;
  eventType: string;
};

interface RootState {
  navbar: Filter;
}

const useStyles = makeStyles({
  containerRow: {
    display: "flex",

  },
  containerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const Root = () => {
  const [events, setEvents] = useState([]);

  const classes = useStyles();

  const { searchPhrase, eventType } = useSelector(
    (state: RootState) => state.navbar
  );

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await axios.get("/api/events");
      if (status === 200) {
        setEvents(data);
      }
    };
    fetchData();
  }, [setEvents]);

  const eventsToDisplay = useMemo(
    () =>
      events.filter((event: Event) => {
        if (searchPhrase === undefined) {
          return event;
        } else if (searchPhrase !== "") {
          return event.nameOfEvent
            .toLowerCase()
            .includes(searchPhrase.toLowerCase());
        }
        if (eventType === "All") {
          return event;
        } else {
          return event.type.toLowerCase().includes(eventType.toLowerCase());
        }
      }),
    [events, searchPhrase, eventType]
  );

  return (
    <>
      <NavBar showFull={true} />
      <div className={classes.containerColumn}>
        <Typography variant="h1" component="h1">
          Welcome to ConcertsApp!
        </Typography>
        <div className={classes.containerRow}>
          {eventsToDisplay.map(
            ({
              _id,
              imageUrl,
              nameOfEvent,
              place,
              dateOfEvent,
              description,
              longDescription,
              type,
              ticketPrice,
            }: Event) => (
              <EventCard
                key={_id}
                id={_id}
                imageUrl={imageUrl}
                nameOfEvent={nameOfEvent}
                place={place}
                dateOfEvent={new Date(dateOfEvent)}
                description={description}
                longDescription={longDescription}
                type={type}
                ticketPrice={ticketPrice}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Root;
