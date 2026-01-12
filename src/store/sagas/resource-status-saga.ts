import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleResourceStatusFailure,
  toggleResourceStatusSuccess,
} from "../slices/features/resource-status-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* patchResourceStatus(action: any) {
  const { payload } = action;
  const { id, data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.patchResourceStatus,
      baseUrl,
      data,
      id
    );

    yield put(toggleResourceStatusSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess();
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

    yield put(toggleResourceStatusFailure({ statusCode, statusText }));
  }
}

export function* watchPatchResourceStatus() {
  yield takeLatest(
    requestTypes.PATCH_RESOURCE_STATUS_REQUEST,
    patchResourceStatus
  );
}
