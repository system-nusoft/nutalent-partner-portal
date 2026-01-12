import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";

import {
  toggleGetDashboardResourceHoursFailure,
  toggleGetDashboardResourceHoursSuccess,
} from "../slices/features/dashboard-resource-hours-data";
import { requestTypes } from "../types";

const appService = new AppService();

function* getDashboardResourceTotalHoursData(action: any) {
  const { payload } = action;
  const { id, data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getDashboardResourceTotalHoursData,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetDashboardResourceHoursSuccess({ ...response }));

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

    yield put(
      toggleGetDashboardResourceHoursFailure({ statusCode, statusText })
    );
  }
}

export function* watchGetResourceTotalHoursDashboard() {
  yield takeLatest(
    requestTypes.GET_DASHBOARD_RESOURCE_HOURS_REQUEST,
    getDashboardResourceTotalHoursData
  );
}
