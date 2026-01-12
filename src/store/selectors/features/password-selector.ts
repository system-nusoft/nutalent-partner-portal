import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const PasswordSelector = (state: TReduxState) => state.features.password;

export const getBaseUrl = createSelector(
  PasswordSelector,
  (app) => app.baseUrl
);

export const getPasswordSelectorData = createSelector(
  PasswordSelector,
  (app) => app.apiStatus.data
);

export const getPasswordSelectorState = createSelector(
  PasswordSelector,
  (app) => app.state
);

export const passwordStateLoading = createSelector(
  getPasswordSelectorState,
  (states) => states.isLoading
);
