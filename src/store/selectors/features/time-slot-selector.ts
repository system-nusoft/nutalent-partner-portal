import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const timeSlotsSelector = (state: TReduxState) => state.features.timeSlots;

export const getBaseUrl = createSelector(
  timeSlotsSelector,
  (app) => app.baseUrl
);

export const getTimeSlotData = createSelector(
  timeSlotsSelector,
  (app) => app.apiStatus.data
);

export const getTimeSlotState = createSelector(
  timeSlotsSelector,
  (app) => app.state
);

export const getTimeSlotLoading = createSelector(
  getTimeSlotState,
  (states) => states.isLoading
);
