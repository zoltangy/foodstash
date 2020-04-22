import React from "react";
//import { useSelector } from "react-redux";
//import { useFirestoreConnect } from "react-redux-firebase";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import RecoverPassword from "./routes/RecoverPassword";
import NavBar from "./components/NavBar";
import StashList from "./routes/StashList";
import StashDetails from "./routes/StashDetails";
import Profile from "./routes/Profile";
import { makeStyles } from "@material-ui/core/styles";
import backround from "./assets/background.png";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    position: "relative",
    "&::after": {
      content: "' '",
      background: `url(${backround})`,
      backgroundRepeat: "repeat",
      opacity: "0.2",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: "-1",
    },
  },
}));

export default function App() {
  const classes = useStyles();
  // const uid = useSelector((state) => state.firebase.auth.uid);
  //useFirestoreConnect([{ collection: "testcollection" }]);
  //const data = useSelector((state) => state.firestore.ordered.testcollection);
  //const profile = useSelector((state) => state.firebase.profile);

  //console.log(profile);

  return (
    <>
      <div className={classes.root}>
        <NavBar />
        <Switch>
          <PublicOnlyRoute path="/signup" component={SignUp} />
          <PublicOnlyRoute path="/signin" component={SignIn} />
          <PublicOnlyRoute path="/recoverPassword" component={RecoverPassword} />
          <PrivateRoute path="/stashlist" component={StashList} />
          <PrivateRoute path="/stash/:id" component={StashDetails} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/" component={() => <div>home</div>} />
        </Switch>
      </div>
    </>
  );
}
