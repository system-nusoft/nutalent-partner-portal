import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const invitePartnerSelector = (state: TReduxState) =>
  state.features.invitePartner;

export const getBaseUrl = createSelector(
  invitePartnerSelector,
  (app) => app.baseUrl
);

export const getInvitePartnerData = createSelector(
  invitePartnerSelector,
  (app) => app.apiStatus.data
);

export const getInvitePartnerState = createSelector(
  invitePartnerSelector,
  (app) => app.state
);

export const invitePartnerLoading = createSelector(
  getInvitePartnerState,
  (states) => states.isLoading
);
