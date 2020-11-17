import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import EventCard from "../../components/EventCard/EventCard";
import NavBar from "../../components/NavBar/NavBar";

type Filter = {
  searchField: string;
  eventType: string;
};

type Event = {
  _id: string;
  imageUrl: string;
  nameOfEvent: string;
  dateOfEvent: Date;
  place: string;
  description: string;
  type: string;
  maxTicketsAmount: number;
  ticketPrice: number;
};

interface RootState {
  navbar: Filter;
}

const Root = () => {
  const [events, setEvents] = useState([]);

  const helperFunc = (state: RootState) => {
    return state.navbar;
  };
  const { searchField, eventType } = useSelector(helperFunc);
  // TODO use redux for events
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
        if (eventType === "All") {
          return event;
        } else {
          return event.type.toLowerCase().includes(eventType.toLowerCase());
        }
        if (searchField === undefined || eventType === undefined) {
          return event;
        } else if (searchField.trim() !== "") {
          return event.nameOfEvent
            .toLowerCase()
            .includes(searchField.toLowerCase());
        }
      }),
    [events, searchField, eventType]
  );

  return (
    <>
      <NavBar />
      <h1>Home Page</h1>
      {eventsToDisplay.map(
        ({
          _id,
          imageUrl,
          nameOfEvent,
          place,
          dateOfEvent,
          description,
          type,
          ticketPrice,
        }: Event) => (
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
