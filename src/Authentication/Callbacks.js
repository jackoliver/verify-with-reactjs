import React from "react";
import CustomSpinner from '../Shared/CustomSpinner';
import { AuthConsumer } from "./AuthProvider";

export const RedirectCallback = (url) => (
  <AuthConsumer>
    {({ signinRedirectCallback }) => {
      signinRedirectCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);

export const PopupCallback = (url) => (
  <AuthConsumer>
    {({ signinPopupCallback }) => {
      signinPopupCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);

export const LogoutCallback = (url) => (
  <AuthConsumer>
    {({ signoutRedirectCallback }) => {
      signoutRedirectCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);