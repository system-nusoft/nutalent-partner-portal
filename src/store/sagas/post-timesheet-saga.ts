import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostTimesheetFailure,
  togglePostTimesheetSuccess,
} from "../slices/features/timesheet-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postTimesheetSaga(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.fetchPostTimesheet,
      baseUrl,
      id,
      data
    );

    yield put(togglePostTimesheetSuccess({ ...response }));

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

    yield put(togglePostTimesheetFailure({ statusCode, statusText }));
  }
}

export function* watchPostTimesheet() {
  yield takeLatest(requestTypes.POST_TIMESHEETS_REQUEST, postTimesheetSaga);
}
