import { createSelector } from "reselect";
/**
 *
 * @param state
 * Implementation of memoized selectors using reselect to get particular data out of store.
 */

const authEntitySelector = (state: TReduxState) => state?.entities?.auth;

export const getIsLoggedIn = createSelector(
  authEntitySelector,
  (app) => app?.data
);

export const getUserRole = createSelector(
  getIsLoggedIn,
  (data: any) => data?.role
);
