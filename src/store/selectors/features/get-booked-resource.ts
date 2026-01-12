import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getBookedResourceSelector = (state: TReduxState) =>
  state.features.getBookedResource;

export const getBaseUrl = createSelector(
  getBookedResourceSelector,
  (app) => app.baseUrl
);

export const getBookedResourceData = createSelector(
  getBookedResourceSelector,
  (app) => app.apiStatus.data
);

export const getBookedResourceState = createSelector(
  getBookedResourceSelector,
  (app) => app.state
);

export const getBookedResourceLoading = createSelector(
  getBookedResourceState,
  (states) => states.isLoading
);
