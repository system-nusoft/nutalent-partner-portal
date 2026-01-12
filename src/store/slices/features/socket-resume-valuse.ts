import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  data: false,
};

export const resumeSocketFeatureSlice = createSlice({
  // A name, used in action types
  name: "socketValues",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleAddSocketData: (state, action) => {
      state.data = action.payload;
    },
    toggleClearSocketData: (state) => {
      state.data = false;
    },
  },
  // A "builder callback" function used to add more reducers
});

export const { toggleAddSocketData, toggleClearSocketData } =
  resumeSocketFeatureSlice.actions;
export const resumeSocketFeatureReducer = resumeSocketFeatureSlice.reducer;
