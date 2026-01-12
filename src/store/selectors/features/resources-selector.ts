import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getResourcesSelector = (state: TReduxState) => state.features.resources;

export const getBaseUrl = createSelector(
  getResourcesSelector,
  (app) => app.baseUrl
);

export const getResourcesData = createSelector(
  getResourcesSelector,
  (app) => app.apiStatus.data
);

export const getResourcesState = createSelector(
  getResourcesSelector,
  (app) => app.state
);

export const getResourcesLoading = createSelector(
  getResourcesState,
  (states) => states.isLoading
);
