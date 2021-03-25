import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Cookies } from "react-cookie";
import "./App.css";
import FormView from "./views/FormView/FormView";
import Root from "./views/Root/Root";
import ResultView from "./views/ResultView/ResultView";
import EventView from "./views/EventView/EventView";
import LoginSignView from "./views/LoginSignView/LoginSignView";
import PurchaseHistoryView from "./views/PurchaseHistoryView/PurchaseHistoryView";
import PrivateRoute from "./PrivateRoute";
import { setIsLoggedIn } from "./actions";

type Filter = {
  searchField: string;
  eventType: string;
  isLoggedIn: boolean;
};

interface RootState {
  navbar: Filter;
}

const App = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.navbar);
  const dispatch = useDispatch();

  useEffect(() => {
    const cookies = new Cookies(["jwt"]);
    if (cookies.get("jwt")) {
      dispatch(setIsLoggedIn(true));
    }
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Root} />
          <Route
            exact
            path="/event/:id"
            component={(props: any) => <EventView {...props} />}
          />
          <Route exact path="/event/:id/form" component={FormView} />
          <PrivateRoute
            authed={isLoggedIn}
            path="/purchase_history"
            component={PurchaseHistoryView}
          />
          <Route
            path="/success"
            component={(props: any) => <ResultView {...props} />}
          />
          <Route
            path="/error"
            component={(props: any) => <ResultView {...props} />}
          />
          <Route
            path="/login"
            component={(props: any) => <LoginSignView {...props} />}
          />
          <Route
            path="/signup"
            component={(props: any) => <LoginSignView {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
