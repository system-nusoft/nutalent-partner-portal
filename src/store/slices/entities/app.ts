import { createSlice } from '@reduxjs/toolkit';
import { fetchAppData } from '../../thunks';


/**
 * An example of creating entity slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  data: null,
};

export const appEntitySlice = createSlice({
  // A name, used in action types
  name: 'app',
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    resetAppData: state => {
      state.data = null;
    },
  },
  // A "builder callback" function used to add more reducers
  extraReducers: builder => {
    builder.addCase(fetchAppData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const appEntityReducer = appEntitySlice.reducer;
