import React from "react";
//import { useSelector } from "react-redux";
//import { useFirestoreConnect } from "react-redux-firebase";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import NavBar from "./components/NavBar";
import Stashes from "./routes/Stashes/";

export default function App() {
  //useFirestoreConnect([{ collection: "testcollection" }]);
  //const data = useSelector((state) => state.firestore.ordered.testcollection);
  //const profile = useSelector((state) => state.firebase.profile);

  //console.log(profile);

  return (
    <>
      <div>
        <NavBar />
        <Switch>
          <PublicOnlyRoute path="/signup">
            <SignUp />
          </PublicOnlyRoute>
          <PublicOnlyRoute path="/signin">
            <SignIn />
          </PublicOnlyRoute>
          <PrivateRoute path="/myStash">
            <Stashes />
          </PrivateRoute>
          <Route path="/">
            <div>home</div>
          </Route>
        </Switch>
      </div>
    </>
  );
}
