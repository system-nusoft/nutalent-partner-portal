import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleDashboardAdminFailure,
  toggleDashboardAdminSuccess,
} from "../slices/features/admin-dashboard-data";
import { requestTypes } from "../types";

const appService = new AppService();

function* getAdmindashboard(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getAdminDashboardData,
      baseUrl
    );

    yield put(toggleDashboardAdminSuccess({ ...response }));

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

    yield put(toggleDashboardAdminFailure({ statusCode, statusText }));
  }
}

export function* watchGetAdmindashboard() {
  yield takeLatest(
    requestTypes.GET_DASHBORD_ADMIN_DATA_REQUEST,
    getAdmindashboard
  );
}
