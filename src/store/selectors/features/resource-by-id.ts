import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourceBySelector = (state: TReduxState) => state.features.resourceById;

export const getBaseUrl = createSelector(
  resourceBySelector,
  (app) => app.baseUrl
);

export const getResourceByIdData = createSelector(
  resourceBySelector,
  (app) => app.apiStatus.data
);

export const getResourceByIdState = createSelector(
  resourceBySelector,
  (app) => app.state
);

export const uploadResourceByIdLoading = createSelector(
  getResourceByIdState,
  (states) => states.isLoading
);
