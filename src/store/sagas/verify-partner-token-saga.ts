import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleVerifyPartnerTokenFailure,
  toggleVerifyPartnerTokenSuccess,
} from "../slices/features/verify-partner-token";
import { requestTypes } from "../types";

const appService = new AppService();

function* postVerifyPartnerToken(action: any) {
  const { payload } = action;
  const { token, userId } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const body = { token: token };

    const response: AxiosResponse<any> = yield call(
      appService.postVerifyPartnerToken,
      baseUrl,
      userId,
      body
    );

    yield put(toggleVerifyPartnerTokenSuccess({ ...response }));

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

    yield put(toggleVerifyPartnerTokenFailure({ statusCode, statusText }));
  }
}

export function* watchVerifyPartnerToken() {
  yield takeLatest(
    requestTypes.VERIFY_PARTNER_TOKEN_REQUEST,
    postVerifyPartnerToken
  );
}
