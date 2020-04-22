import * as actions from "../actions/actionTypes";

const initialState = {
  error: null,
  updateProfile: {
    error: null,
    message: null,
    loading: false,
  },
  updatePassword: {
    error: null,
    message: null,
    loading: false,
  },
  recoverPassword: {
    error: null,
    message: null,
    loading: false,
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
          loading: false,
        },
        updatePassword: {
          ...state.updatePassword,
          error: null,
          message: null,
          loading: false,
        },
        recoverPassword: {
          ...state.recoverPassword,
          error: null,
          message: null,
          loading: false,
        },
      };

    case actions.AUTH_SUCCESS:
      return { ...state, error: null };

    case actions.AUTH_FAIL:
      return { ...state, error: payload };

    case actions.AUTH_UPDATE_PROFILE_START:
      return { ...state, updateProfile: { ...state.updateProfile, loading: true } };

    case actions.AUTH_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        updateProfile: { ...state.updateProfile, loading: false, error: null, message: payload },
      };

    case actions.AUTH_UPDATE_PROFILE_FAIL:
      return {
        ...state,
        updateProfile: { ...state.updateProfile, loading: false, error: payload, message: null },
      };

    case actions.AUTH_UPDATE_PASSWORD_START:
      return { ...state, updatePassword: { ...state.updatePassword, loading: true } };

    case actions.AUTH_UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        updatePassword: { ...state.updatePassword, loading: false, error: null, message: payload },
      };

    case actions.AUTH_UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        updatePassword: { ...state.updatePassword, loading: false, error: payload, message: null },
      };

    case actions.AUTH_RECOVER_PASSWORD_START:
      return { ...state, recoverPassword: { ...state.recoverPassword, loading: true } };

    case actions.AUTH_RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        recoverPassword: { ...state.recoverPassword, loading: false, error: null, message: payload },
      };

    case actions.AUTH_RECOVER_PASSWORD_FAIL:
      return {
        ...state,
        recoverPassword: { ...state.recoverPassword, loading: false, error: payload, message: null },
      };

    default:
      return state;
  }
};
