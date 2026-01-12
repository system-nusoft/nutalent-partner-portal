import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  baseUrl: process.env.REACT_BASE_URL || "",
  loginState: {
    isLoading: false,
    error: null,
  },
  apiStatus: {
    statusCode: null,
    statusText: null,
    data: null,
  },
};

export const signoutFeatureSlice = createSlice({
  // A name, used in action types
  name: "signout",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleSignout: (state) => {
      state.loginState.isLoading = true;
    },
    toggleSignoutSuccess: (state, action) => ({
      ...state,
      loginState: {
        ...state.loginState,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: action.payload?.data,
      },
    }),
    toggleSignoutFailure: (state, action) => ({
      ...state,
      loginState: {
        ...state.loginState,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
        data: null,
      },
    }),
  },
  // A "builder callback" function used to add more reducers
});

export const { toggleSignout, toggleSignoutFailure, toggleSignoutSuccess } =
  signoutFeatureSlice.actions;
export const signoutFeatureReducer = signoutFeatureSlice.reducer;
