import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  data: false,
};

export const createResourceFeatureSlice = createSlice({
  // A name, used in action types
  name: "create-resource",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleCreateResourceData: (state, action) => {
      state.data = action.payload;
    },
    toggleClearCreateResourceData: (state) => {
      state.data = false;
    },
  },
  // A "builder callback" function used to add more reducers
});

export const { toggleCreateResourceData, toggleClearCreateResourceData } =
  createResourceFeatureSlice.actions;
export const createResourceFeatureReducer = createResourceFeatureSlice.reducer;
