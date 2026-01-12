import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getPartnersSelector = (state: TReduxState) => state.features.partners;

export const getBaseUrl = createSelector(
  getPartnersSelector,
  (app) => app.baseUrl
);

export const getPartnersData = createSelector(
  getPartnersSelector,
  (app) => app.apiStatus.data
);

export const getPartnersState = createSelector(
  getPartnersSelector,
  (app) => app.state
);

export const getPartnersLoading = createSelector(
  getPartnersState,
  (states) => states.isLoading
);
