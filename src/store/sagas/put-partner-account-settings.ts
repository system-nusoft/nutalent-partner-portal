import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePutPartnerAccountSettingsFailure,
  togglePutPartnerAccountSettingsSuccess,
} from "../slices/features/put-partner-account";
import { requestTypes } from "../types";

const appService = new AppService();

function* putPartnerAccoutnSettings(action: any) {
  const { payload } = action;
  const { data, id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.putPartnerAccountSettings,
      baseUrl,
      data,
      id
    );

    yield put(togglePutPartnerAccountSettingsSuccess({ ...response }));

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

    yield put(
      togglePutPartnerAccountSettingsFailure({ statusCode, statusText })
    );
  }
}

export function* watchPutPartnerAccountSettings() {
  yield takeLatest(
    requestTypes.PUT_PARTNER_ACCOUNT_REQUEST,
    putPartnerAccoutnSettings
  );
}
