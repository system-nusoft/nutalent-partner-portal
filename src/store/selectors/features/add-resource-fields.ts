import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const addResourceFieldsSelector = (state: TReduxState) =>
  state.features.addResourceFields;

export const getAddResourceFields = createSelector(
  addResourceFieldsSelector,
  (app) => app.data
);
