import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getResourceByIdSelector = (state: TReduxState) =>
  state.features.getResourceById;

export const getBaseUrl = createSelector(
  getResourceByIdSelector,
  (app) => app.baseUrl
);

export const getResourceByIdData = createSelector(
  getResourceByIdSelector,
  (app) => app.apiStatus.data
);

export const getResourceByIdState = createSelector(
  getResourceByIdSelector,
  (app) => app.state
);

export const getResourceByIdLoading = createSelector(
  getResourceByIdState,
  (states) => states.isLoading
);
