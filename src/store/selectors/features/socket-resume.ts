import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const socketResumeSelector = (state: TReduxState) =>
  state.features.socketResume;

export const getSocketResumeValues = createSelector(
  socketResumeSelector,
  (app) => app.data
);
