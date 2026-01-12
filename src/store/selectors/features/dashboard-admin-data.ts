import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const adminDashboardSelector = (state: TReduxState) =>
  state.features.adminDashboardData;

export const getBaseUrl = createSelector(
  adminDashboardSelector,
  (app) => app.baseUrl
);

export const getAdminDashboardData = createSelector(
  adminDashboardSelector,
  (app) => app.apiStatus.data
);

export const getAdminDashboardState = createSelector(
  adminDashboardSelector,
  (app) => app.state
);

export const adminDashboardLoading = createSelector(
  getAdminDashboardState,
  (states) => states.isLoading
);
