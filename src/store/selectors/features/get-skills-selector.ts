import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getSkillSelector = (state: TReduxState) => state.features.skills;

export const getBaseUrl = createSelector(
  getSkillSelector,
  (app) => app.baseUrl
);

export const getSkillsData = createSelector(
  getSkillSelector,
  (app) => app.apiStatus.data
);

export const getSkillState = createSelector(
  getSkillSelector,
  (app) => app.state
);

export const getSkillLoading = createSelector(
  getSkillState,
  (states) => states.isLoading
);
