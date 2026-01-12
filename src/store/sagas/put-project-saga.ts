import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePutProjectFailure,
  togglePutProjectSuccess,
} from "../slices/features/update-project-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* putProjectSaga(action: any) {
  const { payload } = action;
  const { data, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.putProject,
      baseUrl,
      data,
      id
    );

    yield put(togglePutProjectSuccess({ ...response }));

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

    yield put(togglePutProjectFailure({ statusCode, statusText }));
  }
}

export function* watchPutProject() {
  yield takeLatest(requestTypes.PUT_PROJECT_REQUEST, putProjectSaga);
}
