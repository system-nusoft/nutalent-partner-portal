import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";

import {
  toggleGetDashboardRevenueFailure,
  toggleGetDashboardRevenueSuccess,
} from "../slices/features/dashboard-revenue-data";
import { requestTypes } from "../types";

const appService = new AppService();

function* getDashboardRevenueData(action: any) {
  const { payload } = action;
  const { id, data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    let response: AxiosResponse<any>;
    
    // Partner-specific revenue data
    response = yield call(
      appService.getDashboardRevenueData,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetDashboardRevenueSuccess({ ...response }));

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

    yield put(toggleGetDashboardRevenueFailure({ statusCode, statusText }));
  }
}

function* getAdminDashboardRevenueData(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    // SuperAdmin revenue data (platform-wide)
    const response: AxiosResponse<any> = yield call(
      appService.getAdminDashboardRevenueData,
      baseUrl,
      data
    );

    yield put(toggleGetDashboardRevenueSuccess({ ...response }));

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

    yield put(toggleGetDashboardRevenueFailure({ statusCode, statusText }));
  }
}

export function* watchGetRevenueDashboard() {
  yield takeLatest(
    requestTypes.GET_DASHBOARD_REVENUE_REQUEST,
    getDashboardRevenueData
  );
}

export function* watchGetAdminRevenueDashboard() {
  yield takeLatest(
    requestTypes.GET_DASHBOARD_REVENUE_ADMIN_REQUEST,
    getAdminDashboardRevenueData
  );
}
