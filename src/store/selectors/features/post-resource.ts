import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const postResourceSelector = (state: TReduxState) =>
  state.features.postResource;

export const getBaseUrl = createSelector(
  postResourceSelector,
  (app) => app.baseUrl
);

export const getPostResourceData = createSelector(
  postResourceSelector,
  (app) => app.apiStatus.data
);

export const getPostResourceState = createSelector(
  postResourceSelector,
  (app) => app.state
);

export const PostResourceLoading = createSelector(
  getPostResourceState,
  (states) => states.isLoading
);
