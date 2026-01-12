import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const partnerIdSelector = (state: TReduxState) => state.features.partnerId;

export const getPartnerId = createSelector(
  partnerIdSelector,
  (app) => app.state.id
);
