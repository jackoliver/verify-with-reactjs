import React from "react";
import { Route } from "react-router-dom";
import { AuthConsumer } from "../Authentication/AuthProvider";
import Home from '../Home/Home';

export const PrivateRoute = ({ component, ...rest }) => {
  const renderFn = (Component) => (props) => (
    <AuthConsumer>
      {({ isAuthenticated }) => {
        if (!!Component && isAuthenticated()) {
          return <Component {...props} />;
        } else {
          return <Home />;
        }
      }}
    </AuthConsumer>
  );

  return <Route {...rest} render={renderFn(component)} />;
};

export default PrivateRoute;