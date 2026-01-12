import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetResourceByIdFailure,
  toggleGetResourceByIdSuccess,
} from "../slices/features/get-resource-by-id";
import { requestTypes } from "../types";

const appService = new AppService();

function* getResourceBySaga(action: any) {
  const { payload } = action;
  const { id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getResourceById,
      baseUrl,
      id
    );

    yield put(toggleGetResourceByIdSuccess({ ...response }));

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

    yield put(toggleGetResourceByIdFailure({ statusCode, statusText }));
  }
}

export function* watchGetResourceById() {
  yield takeLatest(requestTypes.GET_RESOURCE_BY_ID_REQUEST, getResourceBySaga);
}
