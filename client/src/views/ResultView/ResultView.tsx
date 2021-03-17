import React from "react";
import NavBar from "../../components/NavBar/NavBar";

const ResultView = (props: any) => {
  const { isErrorView } = props.location.state;
  return (
    <>
      <NavBar showFull={false} />
      {!isErrorView ? <h1>Payment was successfull!</h1> : <h1>Error has occured!</h1>}
    </>
  );
};

export default ResultView;
