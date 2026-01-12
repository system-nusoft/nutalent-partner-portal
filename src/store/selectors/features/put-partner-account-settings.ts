import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const putPartnerAccountSettingsSelector = (state: TReduxState) =>
  state.features.putPartnerAccountSettings;

export const getBaseUrl = createSelector(
  putPartnerAccountSettingsSelector,
  (app) => app.baseUrl
);

export const getPutPartnerAccountSettingsData = createSelector(
  putPartnerAccountSettingsSelector,
  (app) => app.apiStatus.data
);

export const getPutPartnerAccountSettingsState = createSelector(
  putPartnerAccountSettingsSelector,
  (app) => app.state
);

export const PutPartnerAccountSettingsLoading = createSelector(
  getPutPartnerAccountSettingsState,
  (states) => states.isLoading
);
