import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import FormView from "./views/FormView/FormView";
import ErrorView from "./views/ErrorView/ErrorView";
import Root from "./views/Root/Root";
import SuccessView from "./views/SuccessView/SuccessView";
import EventView from "./views/EventView/EventView";
import LoginView from "./views/LoginView/LoginView";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Root} />
          <Route exact path="/event/:id" component={(props: any) => <EventView {...props}/>} />
          <Route exact path="/event/:id/form" component={FormView} />
          <Route path="/success" component={SuccessView} />
          <Route path="/error" component={ErrorView} />
          <Route path="/login" component={(props: any) => <LoginView {...props} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
