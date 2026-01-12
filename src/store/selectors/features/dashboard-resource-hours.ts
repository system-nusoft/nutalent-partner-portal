import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const resourceHoursDashboardSelector = (state: TReduxState) =>
  state.features.resourceDashboard;

export const getBaseUrl = createSelector(
  resourceHoursDashboardSelector,
  (app) => app.baseUrl
);

export const getResourceHoursDashboardData = createSelector(
  resourceHoursDashboardSelector,
  (app) => app.apiStatus.data
);

export const getResourceHoursDashboardState = createSelector(
  resourceHoursDashboardSelector,
  (app) => app.state
);

export const dashboardResourceHoursDataLoading = createSelector(
  getResourceHoursDashboardState,
  (states) => states.isLoading
);
