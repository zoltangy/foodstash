import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../store/actions/authActions";
import { isLoaded, isEmpty } from "react-redux-firebase";

export default function NavBar() {
  const auth = useSelector((state) => isLoaded(state.firebase.auth) && !isEmpty(state.firebase.auth));
  const dispatch = useDispatch();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {auth && (
          <>
            <li>
              <Link to="/myStash">myStash</Link>
            </li>
            <li>
              <button type="button" onClick={() => dispatch(signOut())}>
                Log Out
              </button>
            </li>
          </>
        )}
        {!auth && (
          <>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
