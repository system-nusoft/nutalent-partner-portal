import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const authenticationSelector = (state: TReduxState) =>
  state.features.authentication;

export const getBaseUrl = createSelector(
  authenticationSelector,
  (app) => app.baseUrl
);

export const getAuthenticationData = createSelector(
  authenticationSelector,
  (app) => app.apiStatus.data
);
export const getUsername = createSelector(
  getAuthenticationData,
  (app: any) => app?.name
);

export const getAuthenticationState = createSelector(
  authenticationSelector,
  (app) => app.loginState
);

export const authenticationLoading = createSelector(
  getAuthenticationState,
  (states) => states.isLoading
);
