import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleCurrentUserFailure,
  toggleCurrentUserSuccess,
} from "../slices/features/current-user-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getCurrentUser(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getCurrentUser,
      baseUrl
    );

    yield put(toggleCurrentUserSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response?.data });
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

    yield put(toggleCurrentUserFailure({ statusCode, statusText }));
  }
}

export function* watchGetCurrentUser() {
  yield takeLatest(requestTypes.GET_CURRENT_USER_REQUEST, getCurrentUser);
}
