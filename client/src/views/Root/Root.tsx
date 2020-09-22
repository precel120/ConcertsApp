import React from "react";
import EventCard from "../../components/EventCard/EventCard";

const Root = () => {
  return (
    <>
      <h1>Home Page</h1>
      <EventCard
        title="test"
        place="Łódź"
        dateOfEvent={new Date()}
        description="lorem ipsum...."
      />
    </>
  );
};

export default Root;
