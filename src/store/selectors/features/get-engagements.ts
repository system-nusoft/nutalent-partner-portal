import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getEngagementsSelector = (state: TReduxState) =>
  state.features.engagements;

export const getBaseUrl = createSelector(
  getEngagementsSelector,
  (app) => app.baseUrl
);

export const getEngagementsData = createSelector(
  getEngagementsSelector,
  (app) => app.apiStatus.data
);

export const getEngagementsState = createSelector(
  getEngagementsSelector,
  (app) => app.state
);

export const engagementsLoading = createSelector(
  getEngagementsState,
  (states) => states.isLoading
);
