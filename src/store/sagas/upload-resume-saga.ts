import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleUploadResumeFailure,
  toggleUploadResumeSuccess,
} from "../slices/features/upload-resume-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postUploadResume(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postUploadResume,
      baseUrl,
      data
    );

    yield put(toggleUploadResumeSuccess({ ...response }));

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

    yield put(toggleUploadResumeFailure({ statusCode, statusText }));
  }
}

export function* watchUploadResume() {
  yield takeLatest(requestTypes.UPLOAD_RESUME_REQUEST, postUploadResume);
}
