import * as actions from "../actions/actionTypes";

const initialState = {
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.AUTH_CLEAN_UP:
      return { ...state, error: null };

    case actions.AUTH_SUCCESS:
      console.log("Successful authentication");
      return state;

    case actions.AUTH_FAIL:
      return { ...state, error: payload };

    default:
      return state;
  }
};