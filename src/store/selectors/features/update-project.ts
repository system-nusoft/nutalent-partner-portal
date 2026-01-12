import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const updateProjectSelector = (state: TReduxState) =>
  state.features.updateProject;

export const getBaseUrl = createSelector(
  updateProjectSelector,
  (app) => app.baseUrl
);

export const getUpdateProjectData = createSelector(
  updateProjectSelector,
  (app) => app.apiStatus.data
);

export const getUpdateProjectState = createSelector(
  updateProjectSelector,
  (app) => app.state
);

export const updateProjectLoading = createSelector(
  getUpdateProjectState,
  (states) => states.isLoading
);
