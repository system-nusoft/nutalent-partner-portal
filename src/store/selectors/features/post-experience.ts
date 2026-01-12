import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const experienceSelector = (state: TReduxState) => state.features.experience;

export const getBaseUrl = createSelector(
  experienceSelector,
  (app) => app.baseUrl
);

export const getExperienceData = createSelector(
  experienceSelector,
  (app) => app.apiStatus.data
);

export const getExperienceState = createSelector(
  experienceSelector,
  (app) => app.state
);

export const getExperienceLoading = createSelector(
  getExperienceState,
  (states) => states.isLoading
);
