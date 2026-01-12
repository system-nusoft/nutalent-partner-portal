import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const inviteEndUserSelector = (state: TReduxState) =>
  state.features.inviteEndUser;

export const getBaseUrl = createSelector(
  inviteEndUserSelector,
  (app) => app.baseUrl
);

export const getInviteEndUserData = createSelector(
  inviteEndUserSelector,
  (app) => app.apiStatus.data
);

export const getInviteEndUserState = createSelector(
  inviteEndUserSelector,
  (app) => app.state
);

export const inviteEndUserLoading = createSelector(
  getInviteEndUserState,
  (states) => states.isLoading
);
