import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const partnerStatusSelector = (state: TReduxState) =>
  state.features.partnerStatus;

export const getBaseUrl = createSelector(
  partnerStatusSelector,
  (app) => app.baseUrl
);

export const getPartnerStatusData = createSelector(
  partnerStatusSelector,
  (app) => app.apiStatus.data
);

export const getPartnerStatusState = createSelector(
  partnerStatusSelector,
  (app) => app.state
);

export const PartnerStatusLoading = createSelector(
  getPartnerStatusState,
  (states) => states.isLoading
);
