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
      return state;
    //return { ...state, error: payload };

    case actions.MODIFY_STASH_SUCCESS:
      console.log("Stash modified successfully.");
      return state;

    case actions.MODIFY_STASH_FAIL:
      console.log("Stash modify error: ", payload);
      return state;
    //return { ...state, error: payload };

    case actions.DELETE_STASH_SUCCESS:
      console.log("Stash deleted successfully.");
      return state;

    case actions.DELETE_STASH_FAIL:
      console.log("Stash delete error: ", payload);
      return state;
    //return { ...state, error: payload };

    case actions.ADD_ITEM_SUCCESS:
      console.log("Item added successfully.");
      return state;

    case actions.ADD_ITEM_FAIL:
      console.log("Item add error: ", payload);
      return state;
    //return { ...state, error: payload };

    case actions.MODIFY_ITEM_SUCCESS:
      console.log("Item updated successfully.");
      return state;

    case actions.MODIFY_ITEM_FAIL:
      console.log("Item update error: ", payload);
      return state;
    //return { ...state, error: payload };

    case actions.DELETE_ITEM_SUCCESS:
      console.log("Item deleted successfully.");
      return state;

    case actions.DELETE_ITEM_FAIL:
      console.log("Item delete error: ", payload);
      return state;
    //return { ...state, error: payload };

    default:
      return state;
  }
};
