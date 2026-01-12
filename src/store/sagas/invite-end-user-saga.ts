import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleInviteEndUserFailure,
  toggleInviteEndUserSuccess,
} from "../slices/features/invite-end-user.reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postInviteEndUser(action: any) {
  const { payload } = action;
  const { data } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postInviteEndUser,
      baseUrl,
      data
    );

    yield put(toggleInviteEndUserSuccess({ ...response }));

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

    yield put(toggleInviteEndUserFailure({ statusCode, statusText }));
  }
}

export function* watchInviteEndUser() {
  yield takeLatest(requestTypes.INVITE_END_USER_REQUEST, postInviteEndUser);
}
