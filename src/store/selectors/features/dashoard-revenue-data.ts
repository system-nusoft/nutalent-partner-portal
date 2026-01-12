import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const revenueDashboardSelector = (state: TReduxState) =>
  state.features.revenueDashboard;

export const getBaseUrl = createSelector(
  revenueDashboardSelector,
  (app) => app.baseUrl
);

export const getRevenueDashboardData = createSelector(
  revenueDashboardSelector,
  (app) => app.apiStatus.data
);

export const getRevenueDashboardState = createSelector(
  revenueDashboardSelector,
  (app) => app.state
);

export const dashboardRevenueDataLoading = createSelector(
  getRevenueDashboardState,
  (states) => states.isLoading
);
