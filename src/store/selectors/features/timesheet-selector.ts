import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const timesheetSelector = (state: TReduxState) => state.features.timesheet;

export const getBaseUrl = createSelector(
  timesheetSelector,
  (app) => app.baseUrl
);

export const getTimesheetData = createSelector(
  timesheetSelector,
  (app) => app.apiStatus.data
);

export const getTimesheetList = createSelector(
  getTimesheetData,
  (state: any) => state?.items
);
export const getTimesheetMeta = createSelector(
  getTimesheetData,
  (state: any) => state?.meta
);

export const getTimesheetState = createSelector(
  timesheetSelector,
  (app) => app.state
);

export const getTimesheetLoading = createSelector(
  getTimesheetState,
  (states) => states.isLoading
);
