import React from "react";
import { Redirect, Route } from "react-router";

type PrivateRouteProps = {
    exact?: boolean,
    path: string,
    component: React.ComponentType<any>,
    authed: boolean
}

const PrivateRoute = ({
  component: Component,
  authed,
  path,
  ...rest
}: PrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location }}}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
