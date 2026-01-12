import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const accountSetupSelector = (state: TReduxState) =>
  state.features.accountSetup;

export const getBaseUrl = createSelector(
  accountSetupSelector,
  (app) => app.baseUrl
);

export const getAccountSetupData = createSelector(
  accountSetupSelector,
  (app) => app.apiStatus.data
);

export const getAccountSetupState = createSelector(
  accountSetupSelector,
  (app) => app.state
);

export const accountSetupLoading = createSelector(
  getAccountSetupState,
  (states) => states.isLoading
);
