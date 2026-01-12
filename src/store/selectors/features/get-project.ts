import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getProjectSelector = (state: TReduxState) => state.features.getProject;

export const getBaseUrl = createSelector(
  getProjectSelector,
  (app) => app.baseUrl
);

export const getProjectData = createSelector(
  getProjectSelector,
  (app) => app.apiStatus.data
);

export const getProjectState = createSelector(
  getProjectSelector,
  (app) => app.state
);

export const getProjectLoading = createSelector(
  getProjectState,
  (states) => states.isLoading
);
