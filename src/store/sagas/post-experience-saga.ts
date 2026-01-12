import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostExperienceFailure,
  togglePostExperienceSuccess,
} from "../slices/features/post-experience-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postExperienceSaga(action: any) {
  const { payload } = action;
  const { data, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postExperience,
      baseUrl,
      data,
      id
    );

    yield put(togglePostExperienceSuccess({ ...response }));

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

    yield put(togglePostExperienceFailure({ statusCode, statusText }));
  }
}

export function* watchPostExperience() {
  yield takeLatest(requestTypes.POST_EXPERIENCE_REQUEST, postExperienceSaga);
}
