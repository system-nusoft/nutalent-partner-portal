import { createSlice } from "@reduxjs/toolkit";
/**
 * An example of creating feature slices, reducers and INITIAL_STATE.
 */

const INITIAL_STATE = {
  baseUrl: process.env.REACT_BASE_URL || "",
  state: {
    isLoading: false,
    error: null,
  },
  apiStatus: {
    statusCode: null,
    statusText: null,
    data: null,
  },
};

export const timesheetFeatureSlice = createSlice({
  // A name, used in action types
  name: "timesheet",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGetTimesheetListing: (state) => {
      state.state.isLoading = true;
    },
    toggleGetTimesheetListingSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    toggleGetTimesheetListingFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    toggleGetDashboardTimesheetListing: (state) => {
      state.state.isLoading = true;
    },
    toggleGetDashboardTimesheetListingSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    toggleGetDashboardTimesheetListingFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    toggleGetTimesheetById: (state) => {
      state.state.isLoading = true;
    },
    toggleGetTimesheetByIdSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    toggleGetTimesheetByIdFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
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
    togglePostTimesheet: (state) => {
      state.state.isLoading = true;
    },
    togglePostTimesheetSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    togglePostTimesheetFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    togglePostTimesheetRevision: (state) => {
      state.state.isLoading = true;
    },
    togglePostTimesheetRevisionSuccess: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    togglePostTimesheetRevisionFailure: (state, action) => ({
      ...state,
      state: {
        ...state.state,
        error: action.payload?.message,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: action.payload?.statusCode,
        statusText: action.payload?.statusText,
      },
    }),
    toggleClearTimesheet: (state) => ({
      ...state,
      state: {
        ...state.state,
        error: null,
        isLoading: false,
      },
      apiStatus: {
        ...state.apiStatus,
        statusCode: null,
        statusText: null,
        data: null,
      },
    }),
  },
  // A "builder callback" function used to add more reducers
});

export const {
  toggleGetTimesheetListing,
  toggleClearTimesheet,
  toggleGetTimesheetById,
  toggleGetTimesheetByIdFailure,
  toggleGetTimesheetByIdSuccess,
  toggleGetTimesheetListingFailure,
  toggleGetTimesheetListingSuccess,
  togglePostTimesheet,
  togglePostTimesheetFailure,
  togglePostTimesheetSuccess,
  togglePostTimesheetRevision,
  togglePostTimesheetRevisionFailure,
  togglePostTimesheetRevisionSuccess,
  toggleGetDashboardTimesheetListing,
  toggleGetDashboardTimesheetListingFailure,
  toggleGetDashboardTimesheetListingSuccess,
} = timesheetFeatureSlice.actions;
export const timesheetFeatureReducer = timesheetFeatureSlice.reducer;
