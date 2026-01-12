import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const deleteResourceSelector = (state: TReduxState) =>
  state.features.deleteResource;

export const getBaseUrl = createSelector(
  deleteResourceSelector,
  (app) => app.baseUrl
);

export const getDeleteResourceData = createSelector(
  deleteResourceSelector,
  (app) => app.apiStatus.data
);

export const getDeleteResourceState = createSelector(
  deleteResourceSelector,
  (app) => app.state
);

export const deleteResourceLoading = createSelector(
  getDeleteResourceState,
  (states) => states.isLoading
);
