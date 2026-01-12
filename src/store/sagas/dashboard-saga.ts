import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetDashboardDataFailure,
  toggleGetDashboardDataSuccess,
} from "../slices/features/dashboard-data";
import { requestTypes } from "../types";

const appService = new AppService();

function* dsahboardData(action: any) {
  const { payload } = action;
  const { id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getDashboardData,
      baseUrl,
      id
    );

    yield put(toggleGetDashboardDataSuccess({ ...response }));

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

    yield put(toggleGetDashboardDataFailure({ statusCode, statusText }));
  }
}

export function* watchGetDashboardData() {
  yield takeLatest(requestTypes.GET_DASHBOARD_DATA_REQUEST, dsahboardData);
}
