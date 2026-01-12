import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetTimesheetListingFailure,
  toggleGetTimesheetListingSuccess,
} from "../slices/features/timesheet-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getDashboardTimesheetListing(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.fetchGetDashboardTimesheetList,
      baseUrl,
      id,
      data
    );

    yield put(toggleGetTimesheetListingSuccess({ ...response }));

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

    yield put(toggleGetTimesheetListingFailure({ statusCode, statusText }));
  }
}

export function* watchGetDashboardTimesheetListing() {
  yield takeLatest(
    requestTypes.GET_DASHBOARD_TIMESHEETS_REQUEST,
    getDashboardTimesheetListing
  );
}
