import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const updatePasswordSelector = (state: TReduxState) =>
  state.features.verifyPartnerToken;

export const getBaseUrl = createSelector(
  updatePasswordSelector,
  (app) => app.baseUrl
);

export const getUpdatePasswordData = createSelector(
  updatePasswordSelector,
  (app) => app.apiStatus.data
);

export const getUpdatePasswordState = createSelector(
  updatePasswordSelector,
  (app) => app.state
);

export const updatePasswordLoading = createSelector(
  getUpdatePasswordState,
  (states) => states.isLoading
);
