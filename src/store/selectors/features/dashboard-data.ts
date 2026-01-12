import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const dashboardDataSelector = (state: TReduxState) =>
  state.features.dashboardData;

export const getBaseUrl = createSelector(
  dashboardDataSelector,
  (app) => app.baseUrl
);

export const getDashboardData = createSelector(
  dashboardDataSelector,
  (app) => app.apiStatus.data
);

export const getDashboardState = createSelector(
  dashboardDataSelector,
  (app) => app.state
);

export const dashboardDataLoading = createSelector(
  getDashboardState,
  (states) => states.isLoading
);
