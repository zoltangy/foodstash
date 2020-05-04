import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { createFirestoreInstance } from "redux-firestore";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import firebase from "./firebase";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import store from "./store";
import theme from "./theme";
import Loader from "./components/Loader";
import { DialogProvider } from "./components/DialogContext";
import { LoaderProvider } from "./components/LoaderContext";
import { actionTypes } from "redux-firestore";
import ReactPWAInstallProvider from "react-pwa-install";
import "typeface-roboto";

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <Loader open={true} />;
  return children;
}

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  attachAuthIsReady: true,
  onAuthStateChanged: (authData, firebase, dispatch) => {
    // Clear redux-firestore state if auth does not exist (i.e logout)
    if (!authData) {
      dispatch({ type: actionTypes.CLEAR_DATA });
    }
  },
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <ReactPWAInstallProvider>
            <AuthIsLoaded>
              <LoaderProvider>
                <DialogProvider>
                  <BrowserRouter>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <App />
                    </MuiPickersUtilsProvider>
                  </BrowserRouter>
                </DialogProvider>
              </LoaderProvider>
            </AuthIsLoaded>
          </ReactPWAInstallProvider>
        </ReactReduxFirebaseProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
