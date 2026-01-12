import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const createResourceValueSelector = (state: TReduxState) =>
  state.features.createResourceValue;

export const getCreateResourceValues = createSelector(
  createResourceValueSelector,
  (app) => app.data
);
