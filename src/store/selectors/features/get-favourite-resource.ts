import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const getFavourtieResourceSelector = (state: TReduxState) =>
  state.features.getFavouriteResource;

export const getBaseUrl = createSelector(
  getFavourtieResourceSelector,
  (app) => app.baseUrl
);

export const getFavourtieResourceData = createSelector(
  getFavourtieResourceSelector,
  (app) => app.apiStatus.data
);

export const getFavourtieResourceState = createSelector(
  getFavourtieResourceSelector,
  (app) => app.state
);

export const getFavourtieResourceLoading = createSelector(
  getFavourtieResourceState,
  (states) => states.isLoading
);
