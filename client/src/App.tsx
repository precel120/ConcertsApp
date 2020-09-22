import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import FormView from "./views/FormView/FormView";
import ErrorPage from "./views/ErrorPage/ErrorPage";
import Root from "./views/Root/Root";
import SuccessPage from "./views/SuccessPage/SuccessPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Root} />
          <Route path="/form" component={FormView} />
          <Route path="/success" component={SuccessPage} />
          <Route path="/error" component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
