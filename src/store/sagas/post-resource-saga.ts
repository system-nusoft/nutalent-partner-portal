import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostResourceFailure,
  togglePostResourceSuccess,
} from "../slices/features/post-resource-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postResourceSaga(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postResource,
      baseUrl,
      data
    );

    yield put(togglePostResourceSuccess({ ...response }));

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

    yield put(togglePostResourceFailure({ statusCode, statusText }));
  }
}

export function* watchPostResource() {
  yield takeLatest(requestTypes.POST_RESOURCE_REQUEST, postResourceSaga);
}
