import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../../components/EventCard/EventCard";
import NavBar from "../../components/NavBar/NavBar";

const Root = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await axios.get("/api/events");
      if (status === 200) {
        setEvents(data);
      }
    };
    fetchData();
  }, [setEvents]);

  return (
    <>
      <NavBar />
      <h1>Home Page</h1>
      {events.map(
        ({
          _id,
          imageUrl,
          nameOfEvent,
          place,
          dateOfEvent,
          description,
          type,
          ticketPrice,
        }) => (
          <EventCard
            key={_id}
            id={_id}
            imageUrl={imageUrl}
            nameOfEvent={nameOfEvent}
            place={place}
            dateOfEvent={dateOfEvent}
            description={description}
            type={type}
            ticketPrice={ticketPrice}
          />
        )
      )}
    </>
  );
};

export default Root;
