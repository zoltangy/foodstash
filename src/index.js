import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { createFirestoreInstance } from "redux-firestore";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import firebase from "./firebase";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import store from "./store";
import theme from "./theme";
import Loader from "./components/Loader";

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <Loader />;
  return children;
}

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  attachAuthIsReady: true,
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
          <AuthIsLoaded>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthIsLoaded>
        </ReactReduxFirebaseProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
