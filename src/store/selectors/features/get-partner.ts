import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getPartnerSelector = (state: TReduxState) => state.features.partner;

export const getBaseUrl = createSelector(
  getPartnerSelector,
  (app) => app.baseUrl
);

export const getPartnerData = createSelector(
  getPartnerSelector,
  (app) => app.apiStatus.data
);

export const getPartnerState = createSelector(
  getPartnerSelector,
  (app) => app.state
);

export const getPartnerLoading = createSelector(
  getPartnerState,
  (states) => states.isLoading
);
