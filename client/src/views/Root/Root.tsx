import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import EventCard from "../../components/EventCard/EventCard";
import NavBar from "../../components/NavBar/NavBar";

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

const Root = () => {
  const [events, setEvents] = useState([]);
  const [eventsToDisplay, setEventsToDisplay] = useState([]);

  const { searchPhrase, eventType } = useSelector(
    (state: RootState) => state.navbar
  );
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

  useEffect(() => {
    setEventsToDisplay(
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
      })
    );
  }, [events, searchPhrase, eventType, setEventsToDisplay]);

  // const eventsToDisplay = useMemo(
  //   () =>
  //     events.filter((event: Event) => {
  //       if (eventType === "All") {
  //         return event;
  //       } else {
  //         return event.type.toLowerCase().includes(eventType.toLowerCase());
  //       }
  //       if (searchField === undefined || eventType === undefined) {
  //         return event;
  //       } else if (searchField !== "") {
  //         return event.nameOfEvent
  //           .toLowerCase()
  //           .includes(searchField.toLowerCase());
  //       }
  //     }),
  //   [events, searchField, eventType]
  // );

  return (
    <>
      <NavBar showFull={true} />
      {console.log(eventsToDisplay)}
      <h1>Home Page</h1>
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
            dateOfEvent={dateOfEvent}
            description={description}
            longDescription={longDescription}
            type={type}
            ticketPrice={ticketPrice}
          />
        )
      )}
    </>
  );
};

export default Root;
