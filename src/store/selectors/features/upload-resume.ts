import { createSelector } from "reselect";

/**
 *
 * @param state
 */

const uploadResumeSelector = (state: TReduxState) =>
  state.features.uploadResume;

export const getBaseUrl = createSelector(
  uploadResumeSelector,
  (app) => app.baseUrl
);

export const getUploadResumeData = createSelector(
  uploadResumeSelector,
  (app) => app.apiStatus.data
);

export const getUploadResumeState = createSelector(
  uploadResumeSelector,
  (app) => app.state
);

export const uploadResumeLoading = createSelector(
  getUploadResumeState,
  (states) => states.isLoading
);
