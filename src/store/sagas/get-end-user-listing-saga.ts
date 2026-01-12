import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetEndUserListingFailure,
  toggleGetEndUserListingSuccess,
} from "../slices/features/end-user-listing-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* endUserListingSaga(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getEndUserListing,
      baseUrl,
      query
    );

    yield put(toggleGetEndUserListingSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess();
  } catch (errors: any) {
    const error = errors?.data?.errors || errors;
    const { statusCode, statusText } = error;
    Notification({
      type: "error",
      message: errors?.data?.errors?.message || errors?.data?.message,
    });

    payload?.cbFailure &&
      payload?.cbFailure(
        errors?.data?.errors?.message || errors?.data?.message
      );

    yield put(toggleGetEndUserListingFailure({ statusCode, statusText }));
  }
}

export function* watchGetEndUserListing() {
  yield takeLatest(requestTypes.END_USER_LISTING_REQUEST, endUserListingSaga);
}
