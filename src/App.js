import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import { signOut } from "./store/actions/authActions";

function App() {
  //useFirestoreConnect([{ collection: "testcollection" }]);
  //const data = useSelector((state) => state.firestore.ordered.testcollection);
  const profile = useSelector((state) => state.firebase.profile);
  const auth = useSelector((state) => state.firebase.auth);
  const dispatch = useDispatch();

  console.log(profile);
  console.log(auth);
  return (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/myStash">myStash</Link>
            </li>
            <li>
              <button type="button" onClick={() => dispatch(signOut())}>
                Log Out
              </button>
            </li>
          </ul>
        </nav>

        <Switch>
          <PublicOnlyRoute path="/signup">
            <SignUp />
          </PublicOnlyRoute>
          <PublicOnlyRoute path="/signin">
            <SignIn />
          </PublicOnlyRoute>
          <PrivateRoute path="/myStash">
            <div>mystash</div>
          </PrivateRoute>
          <Route path="/">
            <div>home</div>
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
