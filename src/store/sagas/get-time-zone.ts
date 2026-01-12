import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetTimezonesFailure,
  toggleGetTimezonesSuccess,
} from "../slices/features/timezones-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getTimeZonesSaga(action: any) {
  const { payload } = action;

  try {
    const response: AxiosResponse<any> = yield call(appService.getTimeZones);

    yield put(toggleGetTimezonesSuccess({ ...response }));

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

    yield put(toggleGetTimezonesFailure({ statusCode, statusText }));
  }
}

export function* watchGetTimeZones() {
  yield takeLatest(requestTypes.GET_TIME_ZONES_REQUEST, getTimeZonesSaga);
}
