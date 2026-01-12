import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetFavouriteResourceFailure,
  toggleGetFavouriteResourceSuccess,
} from "../slices/features/get-favourite-resource";
import { requestTypes } from "../types";

const appService = new AppService();

function* getFavouriteResourceSaga(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getFavouriteResource,
      baseUrl,
      query
    );

    yield put(toggleGetFavouriteResourceSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response });
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

    yield put(toggleGetFavouriteResourceFailure({ statusCode, statusText }));
  }
}

export function* watchGetFavouriteResource() {
  yield takeLatest(
    requestTypes.GET_FAVOURITE_RESOURCE_REQUEST,
    getFavouriteResourceSaga
  );
}
