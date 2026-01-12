import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const verifyPartnerTokenSelector = (state: TReduxState) =>
  state.features.verifyPartnerToken;

export const getBaseUrl = createSelector(
  verifyPartnerTokenSelector,
  (app) => app.baseUrl
);

export const getVerifyPartnerTokenData = createSelector(
  verifyPartnerTokenSelector,
  (app) => app.apiStatus.data
);

export const getVerifyPartnerTokenState = createSelector(
  verifyPartnerTokenSelector,
  (app) => app.state
);

export const verifyPartnerLoading = createSelector(
  getVerifyPartnerTokenState,
  (states) => states.isLoading
);
