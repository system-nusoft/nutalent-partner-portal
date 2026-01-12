import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePutResourceByIdFailure,
  togglePutResourceByIdSuccess,
} from "../slices/features/resource-by-id-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* putResourceById(action: any) {
  const { payload } = action;
  const { data, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.putResourceById,
      baseUrl,
      data,
      id
    );

    yield put(togglePutResourceByIdSuccess({ ...response }));

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

    yield put(togglePutResourceByIdFailure({ statusCode, statusText }));
  }
}

export function* watchPutResourceById() {
  yield takeLatest(requestTypes.PUT_RESOURCE_BY_ID_REQUEST, putResourceById);
}
