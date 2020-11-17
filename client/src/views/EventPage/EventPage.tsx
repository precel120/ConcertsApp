import React, { useState } from "react";
import { useParams, Redirect } from "react-router-dom";

interface IURLId {
  id: string;
}
// TODO get events info from Redux and display it
const EventPage = () => {
  const { id } = useParams<IURLId>();
  const [redirectToForm, setRedirectToForm] = useState(false);
  const handleClick = () => {
    setRedirectToForm(true);
  };
  return (
    <>
      <h1>Name of event</h1>
      <button onClick={handleClick}>Buy ticket!</button>
      {redirectToForm && <Redirect to={`/event/${id}/form`} />}
    </>
  );
};

export default EventPage;
