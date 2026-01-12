import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePartnerStatusFailure,
  togglePartnerStatusSuccess,
} from "../slices/features/partner-status-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* patchPartnerStatus(action: any) {
  const { payload } = action;
  const { id, data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.patchPartnerStatus,
      baseUrl,
      data,
      id
    );

    yield put(togglePartnerStatusSuccess({ ...response }));

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

    yield put(togglePartnerStatusFailure({ statusCode, statusText }));
  }
}

export function* watchPatchPartnerStatus() {
  yield takeLatest(
    requestTypes.PATCH_PARTNER_STATUS_REQUEST,
    patchPartnerStatus
  );
}
