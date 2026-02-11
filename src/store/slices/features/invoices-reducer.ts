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

export const invoicesFeatureSlice = createSlice({
  // A name, used in action types
  name: "invoices",
  // The initial state for the reducer
  initialState: INITIAL_STATE,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    toggleGetInvoicesListing: (state) => {
      state.state.isLoading = true;
    },
    toggleGetInvoicesListingSuccess: (state, action) => ({
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
    toggleGetInvoicesListingFailure: (state, action) => ({
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
    toggleGetInvoicesById: (state) => {
      state.state.isLoading = true;
    },
    toggleGetInvoicesByIdSuccess: (state, action) => ({
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
    toggleGetInvoicesByIdFailure: (state, action) => ({
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
    togglePatchInvoice: (state) => {
      state.state.isLoading = true;
    },
    togglePatchInvoiceSuccess: (state, action) => ({
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
    togglePatchInvoiceFailure: (state, action) => ({
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
    toggleClearInvoices: (state) => ({
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
    togglePartnerInvoiceAction: (state) => {
      state.state.isLoading = true;
    },
    togglePartnerInvoiceActionSuccess: (state, action) => ({
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
    togglePartnerInvoiceActionFailure: (state, action) => ({
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
    toggleAdminInvoiceAction: (state) => {
      state.state.isLoading = true;
    },
    toggleAdminInvoiceActionSuccess: (state, action) => ({
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
    toggleAdminInvoiceActionFailure: (state, action) => ({
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
    toggleAdminPayPartner: (state) => {
      state.state.isLoading = true;
    },
    toggleAdminPayPartnerSuccess: (state, action) => ({
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
    toggleAdminPayPartnerFailure: (state, action) => ({
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
  },
  // A "builder callback" function used to add more reducers
});

export const {
  toggleClearInvoices,
  toggleGetInvoicesById,
  toggleGetInvoicesByIdFailure,
  toggleGetInvoicesByIdSuccess,
  toggleGetInvoicesListing,
  toggleGetInvoicesListingFailure,
  toggleGetInvoicesListingSuccess,
  togglePatchInvoice,
  togglePatchInvoiceFailure,
  togglePatchInvoiceSuccess,
  togglePartnerInvoiceAction,
  togglePartnerInvoiceActionSuccess,
  togglePartnerInvoiceActionFailure,
  toggleAdminInvoiceAction,
  toggleAdminInvoiceActionSuccess,
  toggleAdminInvoiceActionFailure,
  toggleAdminPayPartner,
  toggleAdminPayPartnerSuccess,
  toggleAdminPayPartnerFailure,
} = invoicesFeatureSlice.actions;
export const invoicesFeatureReducer = invoicesFeatureSlice.reducer;
