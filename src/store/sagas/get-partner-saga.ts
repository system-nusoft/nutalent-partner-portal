import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetPartnerFailure,
  toggleGetPartnerSuccess,
} from "../slices/features/get-partner";
import { requestTypes } from "../types";

const appService = new AppService();

function* getPartner(action: any) {
  const { payload } = action;
  const { id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getPartner,
      baseUrl,
      id
    );

    yield put(toggleGetPartnerSuccess({ ...response }));

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

    yield put(toggleGetPartnerFailure({ statusCode, statusText }));
  }
}

export function* watchGetPartner() {
  yield takeLatest(requestTypes.GET_PARTNER_REQUEST, getPartner);
}
