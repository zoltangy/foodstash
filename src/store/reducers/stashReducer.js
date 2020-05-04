import * as actions from "../actions/actionTypes";

const initialState = {
  error: null,
  shareStash: {
    error: null,
    message: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.STASH_CLEAN_UP:
      return {
        ...state,
        error: null,
        shareStash: {
          error: null,
          message: null,
        },
      };

    case actions.ADD_STASH_SUCCESS:
      return state;

    case actions.ADD_STASH_FAIL:
      return state;

    case actions.MODIFY_STASH_SUCCESS:
      return state;

    case actions.MODIFY_STASH_FAIL:
      return state;

    case actions.DELETE_STASH_SUCCESS:
      return state;

    case actions.DELETE_STASH_FAIL:
      return state;

    case actions.SHARE_STASH_SUCCESS:
      return { ...state, shareStash: { ...state.shareStash, error: null, message: payload } };

    case actions.SHARE_STASH_FAIL:
      return { ...state, shareStash: { ...state.shareStash, error: payload, message: null } };

    case actions.ADD_ITEM_SUCCESS:
      return state;

    case actions.ADD_ITEM_FAIL:
      return state;

    case actions.MODIFY_ITEM_SUCCESS:
      return state;

    case actions.MODIFY_ITEM_FAIL:
      return state;

    case actions.DELETE_ITEM_SUCCESS:
      return state;

    case actions.DELETE_ITEM_FAIL:
      return state;

    default:
      return state;
  }
};
