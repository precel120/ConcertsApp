import React, { useState, useEffect, useMemo } from "react";
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
  // TODO put searchPhrase and eventType in global context
  const temp = (searchPhrase: string, eventType: string) => {
    events.filter((event: any) => {
      if (searchPhrase.trim() === "" && eventType !== "All") {
        return event.type.toLowerCase().includes(eventType.toLowerCase());
      } else if (searchPhrase.trim() !== "" && eventType === "All") {
        return event.nameOfEvent.toLowerCase().includes(searchPhrase.trim().toLowerCase());
      } else {
        return event.nameOfEvent.toLowerCase().inludes(searchPhrase.trim().toLowerCase())
      }
    });
  };

  return (
    <>
      <NavBar temp={temp} />
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
