import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AppService } from "src/services/app";

import { Notification } from "src/components/notification";
import {
  toggleGetInterviewFailure,
  toggleGetInterviewSuccess,
} from "../slices/features/interview-reducer";
import { requestTypes } from "../types";

const authService = new AppService();

function* fetchGetInterView(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      authService.fetchInterviewScheduleList,
      baseUrl,
      data
    );

    yield put(toggleGetInterviewSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response.data });
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

    yield put(toggleGetInterviewFailure({ statusCode, statusText }));
  }
}

export function* watchGetInterviewList() {
  yield takeLatest(requestTypes.GET_INTERVIEWS_REQUEST, fetchGetInterView);
}
