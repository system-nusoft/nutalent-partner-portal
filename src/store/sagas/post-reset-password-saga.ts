import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleResetPasswordFailure,
  toggleResetPasswordSuccess,
} from "../slices/features/password-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postResetPasswordSaga(action: any) {
  const { payload } = action;
  const { userId, token, password } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const data = {
      password,
      token,
    };

    const response: AxiosResponse<any> = yield call(
      appService.postResetPassword,
      baseUrl,
      userId,
      data
    );

    yield put(toggleResetPasswordSuccess({ ...response }));

    payload?.cbSuccess && payload?.cbSuccess({ ...response });
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

    yield put(toggleResetPasswordFailure({ statusCode, statusText }));
  }
}

export function* watchPostResetPassword() {
  yield takeLatest(
    requestTypes.POST_RESET_PASSWORD_REQUEST,
    postResetPasswordSaga
  );
}
