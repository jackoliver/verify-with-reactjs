import React from 'react';
import './App.css';
import Home from './Home/Home';
import {
  RedirectCallback,
  PopupCallback,
  LogoutCallback 
} from './Authentication/Callbacks';
import UserDetails from './UserDetails/UserDetails';
import PrivateRoute from './Shared/PrivateRoute';
import { AuthProvider } from './Authentication/AuthProvider';
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/RedirectCallback" component={ RedirectCallback } />
            <Route exact={true} path="/PopupCallback" component={ PopupCallback } />
            <Route exact={true} path="/logout" component={ LogoutCallback } />
            <PrivateRoute path="/UserDetails" component={ UserDetails } />
            <Route path="/" component={ Home } />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
