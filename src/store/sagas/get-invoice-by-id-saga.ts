import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetInvoicesByIdFailure,
  toggleGetInvoicesByIdSuccess,
} from "../slices/features/invoices-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getInvoicesByIdSaga(action: any) {
  const { payload } = action;
  const { id } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.fetchGetInvoiceById,
      baseUrl,
      id
    );

    yield put(toggleGetInvoicesByIdSuccess({ ...response }));

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

    yield put(toggleGetInvoicesByIdFailure({ statusCode, statusText }));
  }
}

export function* watchGetInvoiceById() {
  yield takeLatest(
    requestTypes.GET_INVOICES_BY_ID_REQUEST,
    getInvoicesByIdSaga
  );
}
