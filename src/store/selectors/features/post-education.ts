import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const postEducationSelector = (state: TReduxState) =>
  state.features.postEducation;

export const getBaseUrl = createSelector(
  postEducationSelector,
  (app) => app.baseUrl
);

export const getPostEducationData = createSelector(
  postEducationSelector,
  (app) => app.apiStatus.data
);

export const getPostEducationState = createSelector(
  postEducationSelector,
  (app) => app.state
);

export const getPostEducationLoading = createSelector(
  getPostEducationState,
  (states) => states.isLoading
);
