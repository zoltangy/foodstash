import * as actions from "../actions/actionTypes";

const initialState = {
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.STASH_CLEAN_UP:
      return { ...state, error: null };

    case actions.ADD_STASH_SUCCESS:
      console.log("New stash created successfully.");
      return state;

    case actions.ADD_STASH_FAIL:
      console.log("Stash add error: ", payload);
      return { ...state, error: payload };

    default:
      return state;
  }
};
