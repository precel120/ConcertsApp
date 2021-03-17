import React from "react";
import NavBar from "../../components/NavBar/NavBar";

const SuccessView = () => {
  return (
    <>
      <NavBar showFull={false} />
      <h1>Payment was successfull!</h1>
    </>
  );
};

export default SuccessView;
