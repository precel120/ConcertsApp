import React from "react";
import NavBar from "../../components/NavBar/NavBar";

const ErrorView = () => {
  return (
    <>
      <NavBar showFull={false} />
      <h1>An error has occurred!</h1>
    </>
  );
};

export default ErrorView;
