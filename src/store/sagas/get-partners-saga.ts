import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetPartnersFailure,
  toggleGetPartnersSuccess,
} from "../slices/features/get-partners-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getPartnersSaga(action: any) {
  const { payload } = action;
  const { query } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getPartners,
      baseUrl,
      query
    );

    yield put(toggleGetPartnersSuccess({ ...response }));

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

    yield put(toggleGetPartnersFailure({ statusCode, statusText }));
  }
}

export function* watchPartners() {
  yield takeLatest(requestTypes.GET_PARTNERS_REQUEST, getPartnersSaga);
}
