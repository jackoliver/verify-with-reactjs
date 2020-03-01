# Integrate Criipto Verify with oidc-client and React App

This is a simple demo app showing how to configure oidc-client for React and enable authentication using Criipto Verify brokered e-ID login.

Below is a quick start tutorial which will cover the following:
1. Running the sample
2. Register your application in Criipto Verify
3. Configure oidc-client for Code Flow (with PKCE)
4. Setup authentication in your application
    1. Setup authentication with redirect
    2. Setup authentication in an iframe or a popup window
    3. Setup user logout
5. Setting up a private route
6. Testing the application


## Running the sample

Run `npm install` to install all dependencies.

Run `npm start` to build and start the app.

Note: If `npm install` fails with `Error: EPERM: operation not permitted`, it could be because your antivirus was using one of the files at the same time when npm tried to access it. Try running `npm install` one more time after the antivirus is done scanning the directory.


## Register your application in Criipto Verify
After you signed up for Criipto Verify, you must register an application before you can actually try logging in with any e-ID.

Once you register your application you will also need some of the information for communicating with Criipto Verify. You get these details from the settings of the application in the dashboard.

Specifically you need the following information to configure you application:
- Client ID to identify you application to Criipto Verify. Eg. `urn:criipto:samples:no1`
- Domain on which you will be communicating with Criipto Verify. Eg. `samples.criipto.id`


### Register callback URLs
Before you can start sending authentication requests to Criipto Verify you need to register the URLs on which you want to receive the returned Code/JSON Web Token, JWT.

The Callback URL of your application is the URL where Criipto Verify will redirect to after the user has authenticated in order for the oidc-client to complete the authentication process.

You will need to add this URL to the list of allowed URLs for your application. The Callback URLs for this sample project are:
- https://localhost:3000/RedirectCallback (for the redirect signin)
- https://localhost:3000/PopupCallback (for the popup or iframe signin)
- http://localhost:3000/logout/callback (for the logout) 

Please make sure to add these to the Callback URLs section of your application. Put each URL on a new line.

If you deploy your application to a different URL, make sure to add that URL to the Callback URLs, too.

![image1](https://i.ibb.co/qgXKnX2/scr1.png)


### Configure the code flow
If you are creating a new application you must first save the configuration.

Once you saved the configuration you are ready to configure the OpenID Connect for Callback on location hash. Open the application registration and enable Callback on location hash.

![image1](https://i.ibb.co/KGJnW5Q/scr2.png)


## Configure oidc-client for Code Flow (with PKCE)
In this demo app we will be using certified oidc-client, so if you are building a new app, pleas make sure to do npm instal for oidc-client-js. We recommend version 1.6.1 or above as it supports the Code Flow (with PKCE) which is more secure compared to the traditional Implicit Flow.

To set up oidc-client you need to initialize UserManager and pass the settings object to it's constructor.
```javascript
new UserManager({
  authority: process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY, // Your Criipto Domain eg. https://<YOUR_COMPANY>.criipto.id
  client_id: process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID, // Your Criipto Client ID/Realm
  redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_REDIRECT_URI, // The Callback URI of your application where Criipto Verify will redirect to after the user has authenticated
  responseType: process.env.REACT_APP_IDENTITY_CONFIG_RESPONSE_TYPE, // The type of response desired from Criipto Verify
  post_logout_redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_POST_LOGOUT_REDIRECT_URI, // The Callback URI of your application where Criipto Verify will redirect to after the user has signed out
  acr_values: acr_values, // Specific authentication service to use eg. for login with Vipps app: urn:grn:authn:no:vipps
  userStore: new WebStorageStateStore({ store: window.sessionStorage }), // Storage object used to persist currently authenticated user
  // The following settings are optional and are required only if you'll be using those features
  popup_redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_POPUP_REDIRECT_URI, // The Callback URI of your application which handles the Popup callback
  popupWindowFeatures: process.env.REACT_APP_IDENTITY_CONFIG_POPUP_WINDOW_FEATURES, // Use this to customize a popup window
  popupWindowTarget: popupWindowTarget
});
```

We store the actual values in .env files because you will most likely have different values for development and production build.

Actual values for this demo app are:
```
REACT_APP_IDENTITY_CONFIG_AUTHORITY=https://goran-demo-app-test.criipto.id
REACT_APP_IDENTITY_CONFIG_CLIENT_ID=urn:criipto:react:demo:5152
REACT_APP_IDENTITY_CONFIG_REDIRECT_URI=http://localhost:3000/RedirectCallback
REACT_APP_IDENTITY_CONFIG_RESPONSE_TYPE=code
REACT_APP_IDENTITY_CONFIG_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/logout/callback
REACT_APP_IDENTITY_CONFIG_POPUP_REDIRECT_URI=http://localhost:3000/PopupCallback
REACT_APP_IDENTITY_CONFIG_POPUP_WINDOW_FEATURES=location=no,toolbar=no,width=600,height=500,left=100,top=100
```

It is very important to set the responseType to `code` because that will trigger the oidc-client to use the Code Flow (with PKCE) rather than the Implicit Flow!

Some settings as well as metadata properties are set automatically by oidc-client. You can read more about it [here](https://github.com/IdentityModel/oidc-client-js/wiki).

If you are using only one login option, you can set it's acr_values in .env files and your application will always use the specified login option, but if you want to let the user choose the login option, then you will have to set the acr_values dynamically and initialize a new instance of the UserManager every time the login option changes. Don't worry, oidc-client supports multiple instances of UserManager across the app.

Below is the list of supported login options and it's acr_values:
```javascript
// src\Authentication\LoginOptionsConfig.js
export const LOGIN_OPTIONS = [
  {
    Id: 0,
    ShortName: "NO BankID",
    FullName: "Norwegian BankID",
    AcrValues: "urn:grn:authn:no:bankid",
    isForIFrame: true
  },
  {
    Id: 1,
    ShortName: "NO Vipps",
    FullName: "Norwegian Vipps",
    AcrValues: "urn:grn:authn:no:vipps",
    isForIFrame: false
  },
  {
    Id: 2,
    ShortName: "SE BankID SD",
    FullName: "Swedish BankID Same Device",
    AcrValues: "urn:grn:authn:se:bankid:same-device",
    isForIFrame: false
  },
  {
    Id: 3,
    ShortName: "SE BankID AD",
    FullName: "Swedish BankID Another Device",
    AcrValues: "urn:grn:authn:se:bankid:another-device",
    isForIFrame: true
  },
  {
    Id: 4,
    ShortName: "DK NemID PCC",
    FullName: "Danish NemID Personal with code card",
    AcrValues: "urn:grn:authn:dk:nemid:poces",
    isForIFrame: true
  },
  {
    Id: 5,
    ShortName: "DK NemID ECC",
    FullName: "Danish NemID Employee with code card",
    AcrValues: "urn:grn:authn:dk:nemid:moces",
    isForIFrame: true
  },
  {
    Id: 6,
    ShortName: "DK NemID ECF",
    FullName: "Danish NemID Employee with code file",
    AcrValues: "urn:grn:authn:dk:nemid:moces:codefile",
    isForIFrame: true
  },
  {
    Id: 7,
    ShortName: "FI e-ID BankID",
    FullName: "Finish e-ID - BankID",
    AcrValues: "urn:grn:authn:fi:bankid",
    isForIFrame: false
  },
  {
    Id: 8,
    ShortName: "FI e-ID MC",
    FullName: "Finish e-ID - Mobile certificate",
    AcrValues: "urn:grn:authn:fi:mobile-id",
    isForIFrame: true
  },
  {
    Id: 9,
    ShortName: "FI e-ID ALL",
    FullName: "Finish e-ID - ALL",
    AcrValues: "urn:grn:authn:fi:all",
    isForIFrame: true
  }
];
```

In our demo app we have created an additional class `AuthService` which initializes the UserManager and implements necessary login and logout functions as well as the isAuthorized function. It also adds an event listener which will raise the `LoginSuccess` event on the top window.

```javascript
// scr\Authentication\AuthService.js
import { UserManager, WebStorageStateStore } from "oidc-client";

export default class AuthService {
  UserManager;

  constructor(acr_values, popupWindowTarget) {
    this.UserManager = new UserManager({
      authority: process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY, // Your Criipto Domain eg. https://<YOUR_COMPANY>.criipto.id
      client_id: process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID, // Your Criipto Client ID/Realm
      redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_REDIRECT_URI, // The Callback URI of your application where Criipto Verify will redirect to after the user has authenticated
      responseType: process.env.REACT_APP_IDENTITY_CONFIG_RESPONSE_TYPE, // The type of response desired from Criipto Verify
      post_logout_redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_POST_LOGOUT_REDIRECT_URI, // The Callback URI of your application where Criipto Verify will redirect to after the user has signed out
      acr_values: acr_values, // Specific authentication service to use eg. for login with Vipps app: urn:grn:authn:no:vipps
      userStore: new WebStorageStateStore({ store: window.sessionStorage }), // Storage object used to persist currently authenticated user
      // The following settings are optional and are required only if you'll be using those features
      popup_redirect_uri: process.env.REACT_APP_IDENTITY_CONFIG_POPUP_REDIRECT_URI, // The Callback URI of your application which handles the Popup callback
      popupWindowFeatures: process.env.REACT_APP_IDENTITY_CONFIG_POPUP_WINDOW_FEATURES, // Use this to customize a popup window
      popupWindowTarget: popupWindowTarget
    });

    this.UserManager.events.addUserLoaded(() => {
      window.top.dispatchEvent(new Event("LoginSuccess"));
    });
  }

  signinRedirect = () => {
    this.UserManager.signinRedirect();
  };

  signinPopup = () => {
    this.UserManager.signinPopup();
  };

  signinRedirectCallback = () => {
    this.UserManager.signinRedirectCallback()
    // do something after successful authentication
    .then(() => {
      window.location.replace("/");
    })
    // do something if there was an error
    .catch(() => {
      window.location.replace("/");
    });
  };

  signinPopupCallback = () => {
    this.UserManager.signinPopupCallback();
  };

  logout = () => {
    this.UserManager.signoutRedirect();
  };

  signoutRedirectCallback = () => {
    // UserManager will notify Criipto Verify about the logout
    this.UserManager.signoutRedirectCallback().then(() => {
      // Here we have to clear the persisted user
      localStorage.clear();
      window.location.replace("/");
    });
    this.UserManager.clearStaleState();
  };

  isAuthenticated = () => {
    const oidcStorage = JSON.parse(
      sessionStorage.getItem(
        `oidc.user:${ process.env.REACT_APP_IDENTITY_CONFIG_AUTHORITY }:${ process.env.REACT_APP_IDENTITY_CONFIG_CLIENT_ID }`
        )
      );
    return (!!oidcStorage && !!oidcStorage.id_token);
  };
}
```

To make the AuthService accessible accross the app, we have created a React Context which will be exposed as AuthProvider component and used on callback routes.

```javascript
// src\Authentication\AuthProvider.js
import React, { Component } from "react";
import AuthService from "./AuthService";

const AuthContext = React.createContext();

export const AuthConsumer = AuthContext.Consumer;

export class AuthProvider extends Component {
  authService;
  constructor(props) {
    super(props);
    this.authService = new AuthService();
  }
  render() {
    return <AuthContext.Provider value={this.authService}>{this.props.children}</AuthContext.Provider>;
  }
}
```

## Setup authentication in your application
Oidc-client offers two ways to do the authentication:
- By redirecting the user to the authentication page (signinRedirect) or
- By showing the authentication page in a popup window or in an iframe (signinPopup)

### Setup authentication with redirect
To start the authentication process you have to call the `signinRedirect()` method of the `AuthService` which will call the same method of the `UserManager` and automatically redirect the user to the authentication page associated with the chosen login option.

Now the only thing left to do is to set up a callback route where we will receive a response. For that purpose we have created a `RedirectCallback` component where we will be using our `AuthConsumer` component from the `AuthContext` so that we can access the `AuthService` and it's methods.

To process the response, oidc-client provides the `signinRedirectCallback()` method which will finish the authentication process and persist the user in the local storage.

```javascript
// src\Authentication\Callbacks.js
export const RedirectCallback = (url) => (
  <AuthConsumer>
    {({ signinRedirectCallback }) => {
      signinRedirectCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);
```

In the `AuthService`, the `signinRedirectCallback()` method is calling `this.UserManager.signinRedirectCallback()` which will return a Promise. That means that if we want to specify what happens on successful or unsuccessful login, we can simply call `then()` or `catch()` methods and pass them the appropriate function.

```javascript
// scr\Authentication\AuthService.js

signinRedirectCallback = () => {
  this.UserManager.signinRedirectCallback()
  // do something after successful authentication
  .then(() => {
    window.location.replace("/");
  })
  // do something if there was an error
  .catch(() => {
    window.location.replace("/");
  });
};
```

### Setup authentication in an iframe or a popup window
Oidc-client also provides a way to implement the authentication in a new window which can be opened as a new browser window or displayed inside of an iframe in the application. To enable popupSignin it is very important to set some additional settings in the `UserManager` settings object:
- `popup_redirect_uri` - A URI where you will receive a response from Criipto service. Don't forget to register it as one of the callback URIs.
- `popupWindowFeatures` - Provides a way to customise the look of a new window. Eg. `location=no,toolbar=no,width=600,height=500,left=100,top=100`
- `popupWindowTarget` - Set this to `_blank` if you want a new browser window or set it to you iframe's name if you want it to show inside of an iframe.

Note: if you are showing the window inside of an iframe, make sure that the iframe is generated in the DOM before you start the authentication process, otherwise a new browser window will be created.

Since our demo app implements both options, we are setting the `popupWindowTarget` value dynamically through the constructor of `AuthService`, but if you'll be using only one option, you can set it in you .env file.

To start the authentication process, you just have to call the `signinPopup()` method of the `AuthService` which will call the same method of the `UserManager` and start the authentication process.

Now we have to set up a callback route for the signinPopup just as we did for the signinRedirect, only this time we will be calling `signinPopupCallback()` method of the `AuthService` to finish the authentication process and persist the user. 

```javascript
// src\Authentication\Callbacks.js
export const PopupCallback = (url) => (
  <AuthConsumer>
    {({ signinPopupCallback }) => {
      signinPopupCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);
```

The `UserManager` will close a new browser window on it's own, but if you are implementing the authentication inside of an iframe, you will have to handle that part on your own. To make that easier, the `AuthService` will raise the `LoginSuccess` event on the top window, so you can register an event listener which will, for example, close the login modal or remove the iframe from the DOM. Make sure to register the event listener before the authentication process starts and to remove it after it ends. In our demo app, we register it when the user clicks on the login button.

```javascript
// scr\Home\Home.js
onIframeLoginSuccess = () => {
  this.setState({ showLogin: false });
  window.removeEventListener("LoginSuccess", this.onIframeLoginSuccess);
}

onPopupLoginSuccess = () => {
  this.forceUpdate();
  window.removeEventListener("LoginSuccess", this.onPopupLoginSuccess);
}

onLoginClick = () => {
  if(this.state.loginDisplayOption === "redirect"){
    new AuthService(LOGIN_OPTIONS[this.state.chosenOption].AcrValues).signinRedirect();
  } else if(this.state.loginDisplayOption === "iframe"){
    this.setState({ showLogin: true });
    window.addEventListener("LoginSuccess", this.onIframeLoginSuccess);
  } else if(this.state.loginDisplayOption === "popup"){
    new AuthService(LOGIN_OPTIONS[this.state.chosenOption].AcrValues, "_blank").signinPopup();
    window.addEventListener("LoginSuccess", this.onPopupLoginSuccess);
  }
}
```

### Setup user logout
To start the process of a user logout, just call the `logout()` method of the `AuthService` which will call the `signoutRedirect()` method of the `UserManager` and start the logout process.

You also need to set up a callback route where you will receive the response. For that purpose we have created `LogoutCallback` component which is implemented in the similar way as Login callback components.

```javascript
// src\Authentication\Callbacks.js
export const LogoutCallback = (url) => (
  <AuthConsumer>
    {({ signoutRedirectCallback }) => {
      signoutRedirectCallback();
      return url.location.search.includes("error") ? <p>There has been an error! Pleas try again.</p> : <CustomSpinner />;
    }}
  </AuthConsumer>
);
```

The `signoutRedirectCallback()` method of the `UserManager` will return a Promise, so we can call `then()` method on the returned promise and pass in the function to execute on the successful user logout. There we can clear the persisted user from the local storage and redirect the user to the public route.

```javascript
// src\Authentication\AuthService.js
signoutRedirectCallback = () => {
  // UserManager will notify Criipto Verify about the logout
  this.UserManager.signoutRedirectCallback().then(() => {
    // Do something after the user logs out
    localStorage.clear();
    this.UserManager.clearStaleState();
    window.location.replace("/");
  });
};
```


## Setting up a private route
To set up a private rout first you have to wrap the entire BrowserRouter with the AuthProvider component, so that you can access the AuthService. After that we have created a special PrivateRout component which will check if a user is authenticated and load the appropriate component.

```javascript
// src\Shared\PrivateRoute.js
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
```

## Testing the application
To test the application you will have to obtain test accounts depending on the login option that you want to use. For more details, pleas take a look at the [Criipto Documentation](https://docs.criipto.com/how-to/test-users).
