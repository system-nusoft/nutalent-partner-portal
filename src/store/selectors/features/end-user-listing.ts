import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const endUserListingSelector = (state: TReduxState) =>
  state.features.enduserListing;

export const getBaseUrl = createSelector(
  endUserListingSelector,
  (app) => app.baseUrl
);

export const getEndUserListingData = createSelector(
  endUserListingSelector,
  (app) => app.apiStatus.data
);

export const getEndUserListingState = createSelector(
  endUserListingSelector,
  (app) => app.state
);

export const getEndUserListingLoading = createSelector(
  getEndUserListingState,
  (states) => states.isLoading
);
