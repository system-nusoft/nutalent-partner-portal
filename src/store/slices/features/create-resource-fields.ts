import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  data: [],
};

export const addResourceFieldsFeatureSlice = createSlice({
  // A name, used in action types
  name: "create-resource-fields",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleAddResourceFields: (state, action) => {
      state.data = action.payload;
    },
    toggleClearAddResourceFields: (state) => {
      state.data = [];
    },
  },
  // A "builder callback" function used to add more reducers
});

export const { toggleAddResourceFields, toggleClearAddResourceFields } =
  addResourceFieldsFeatureSlice.actions;
export const addResourceFieldsFeatureReducer =
  addResourceFieldsFeatureSlice.reducer;
