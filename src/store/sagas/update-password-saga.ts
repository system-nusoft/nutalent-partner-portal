import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleUpdatePasswordFailure,
  toggleUpdatePasswordSuccess,
} from "../slices/features/update-password-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* patchUpdatePassword(action: any) {
  const { payload } = action;
  const { currentPassword, newPassword } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const data = { currentPassword, newPassword };

    const response: AxiosResponse<any> = yield call(
      appService.patchUpdatePassword,
      baseUrl,
      data
    );

    yield put(toggleUpdatePasswordSuccess({ ...response }));

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

    yield put(toggleUpdatePasswordFailure({ statusCode, statusText }));
  }
}

export function* watchUpdatePassword() {
  yield takeLatest(requestTypes.UPDATE_PASSWORD_REQUEST, patchUpdatePassword);
}
