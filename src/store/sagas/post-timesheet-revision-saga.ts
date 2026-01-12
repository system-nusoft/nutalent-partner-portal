import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostTimesheetRevisionFailure,
  togglePostTimesheetRevisionSuccess,
} from "../slices/features/timesheet-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postTimesheetRevisionSaga(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.fetchPostTimesheetRevision,
      baseUrl,
      id,
      data
    );

    yield put(togglePostTimesheetRevisionSuccess({ ...response }));

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

    yield put(togglePostTimesheetRevisionFailure({ statusCode, statusText }));
  }
}

export function* watchPostTimesheetRevision() {
  yield takeLatest(
    requestTypes.POST_TIMESHEETS_REVISION_REQUEST,
    postTimesheetRevisionSaga
  );
}
