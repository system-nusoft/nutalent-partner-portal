import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import { toggleGetPartnerFailure } from "../slices/features/get-partner";
import { toggleGetResourcesSuccess } from "../slices/features/get-resources-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getResources(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getResources,
      baseUrl,
      query
    );

    yield put(toggleGetResourcesSuccess({ ...response }));

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

    yield put(toggleGetPartnerFailure({ statusCode, statusText }));
  }
}

export function* watchGetResources() {
  yield takeLatest(requestTypes.GET_RESOURCES_REQUEST, getResources);
}
