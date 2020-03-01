import React from 'react';
import Button from 'react-bootstrap/Button';
import './UserDetails.css';

const lodeHomeScreen = () => {
  window.location.replace("/");
}

const UserDetails = () => {
  const user = JSON.parse(
    sessionStorage.getItem(
      `oidc.user:${ process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY }:${ process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID }`
      )
    ).profile;

  return (
    <div className="content">
      {
        Object.keys(user).map(item => {
          return(
            <p><b>{ item }:</b> { user[item] }</p>
          );
        })
      }
      <Button variant="outline-primary" className="button" onClick={ lodeHomeScreen }>Back</Button>
    </div>
  );
}

export default UserDetails;