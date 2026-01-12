import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  state: {
    id: null,
  },
};

export const navigatePartnerIdFeatureSlice = createSlice({
  // A name, used in action types
  name: "navigatePartnerId",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleSetPartnerId: (state, action) => {
      state.state.id = action.payload;
    },
  },
  // A "builder callback" function used to add more reducers
});

export const { toggleSetPartnerId } = navigatePartnerIdFeatureSlice.actions;
export const navigatePartnerIdFeatureReducer =
  navigatePartnerIdFeatureSlice.reducer;
