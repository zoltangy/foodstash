import * as actions from "../actions/actionTypes";

const initialState = {
  error: null,
  updateProfile: {
    error: null,
    message: null,
  },
  updatePassword: {
    error: null,
    message: null,
  },
  recoverPassword: {
    error: null,
    message: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.AUTH_CLEAN_UP:
      return {
        ...state,
        error: null,
        updateProfile: {
          ...state.updateProfile,
          error: null,
          message: null,
        },
        updatePassword: {
          ...state.updatePassword,
          error: null,
          message: null,
        },
        recoverPassword: {
          ...state.recoverPassword,
          error: null,
          message: null,
        },
      };

    case actions.AUTH_SUCCESS:
      return { ...state, error: null };

    case actions.AUTH_FAIL:
      return { ...state, error: payload };

    case actions.AUTH_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        updateProfile: { ...state.updateProfile, error: null, message: payload },
      };

    case actions.AUTH_UPDATE_PROFILE_FAIL:
      return {
        ...state,
        updateProfile: { ...state.updateProfile, error: payload, message: null },
      };

    case actions.AUTH_UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        updatePassword: { ...state.updatePassword, error: null, message: payload },
      };

    case actions.AUTH_UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        updatePassword: { ...state.updatePassword, error: payload, message: null },
      };

    case actions.AUTH_RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        recoverPassword: { ...state.recoverPassword, error: null, message: payload },
      };

    case actions.AUTH_RECOVER_PASSWORD_FAIL:
      return {
        ...state,
        recoverPassword: { ...state.recoverPassword, error: payload, message: null },
      };

    default:
      return state;
  }
};
