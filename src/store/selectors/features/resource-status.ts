import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourceStatusSelector = (state: TReduxState) =>
  state.features.resourceStatus;

export const getBaseUrl = createSelector(
  resourceStatusSelector,
  (app) => app.baseUrl
);

export const getResourceStatusData = createSelector(
  resourceStatusSelector,
  (app) => app.apiStatus.data
);

export const getResourceStatusState = createSelector(
  resourceStatusSelector,
  (app) => app.state
);

export const resourceStatusLoading = createSelector(
  getResourceStatusState,
  (states) => states.isLoading
);
