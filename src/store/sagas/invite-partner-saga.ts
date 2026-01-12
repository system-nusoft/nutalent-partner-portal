import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleInvitePartnerFailure,
  toggleInvitePartnerSuccess,
} from "../slices/features/invite-partner-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postInvitePartner(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postInvitePartner,
      baseUrl,
      data
    );

    yield put(toggleInvitePartnerSuccess({ ...response }));

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

    yield put(toggleInvitePartnerFailure({ statusCode, statusText }));
  }
}

export function* watchInvitePartner() {
  yield takeLatest(requestTypes.INVITE_PARTNER_REQUEST, postInvitePartner);
}
