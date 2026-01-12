import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const postSkillSelector = (state: TReduxState) => state.features.postSkill;

export const getBaseUrl = createSelector(
  postSkillSelector,
  (app) => app.baseUrl
);

export const getPostSkillData = createSelector(
  postSkillSelector,
  (app) => app.apiStatus.data
);

export const getPostSkillState = createSelector(
  postSkillSelector,
  (app) => app.state
);

export const getPostSkillLoading = createSelector(
  getPostSkillState,
  (states) => states.isLoading
);
