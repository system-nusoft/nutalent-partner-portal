import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getCurrentUserSelector = (state: TReduxState) =>
  state.features.currentUser;

export const getBaseUrl = createSelector(
  getCurrentUserSelector,
  (app) => app.baseUrl
);

export const getCurrentUserData = createSelector(
  getCurrentUserSelector,
  (app) => app.apiStatus.data
);

export const getCurrentUserState = createSelector(
  getCurrentUserSelector,
  (app) => app.state
);

export const getCurrentUserLoading = createSelector(
  getCurrentUserState,
  (states) => states.isLoading
);
