import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePatchInvoiceFailure,
  togglePatchInvoiceSuccess,
} from "../slices/features/invoices-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* patchInvoiceStatus(action: any) {
  const { payload } = action;
  const { id, data } = payload;
  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.fetchPatchInvoice,
      baseUrl,
      id,
      data
    );

    yield put(togglePatchInvoiceSuccess({ ...response }));

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

    yield put(togglePatchInvoiceFailure({ statusCode, statusText }));
  }
}

export function* watchPatchInvoice() {
  yield takeLatest(requestTypes.PATCH_INVOICE_REQUEST, patchInvoiceStatus);
}
