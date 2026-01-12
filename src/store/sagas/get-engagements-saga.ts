import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetEngagementsFailure,
  toggleGetEngagementsSuccess,
} from "../slices/features/get-engagements-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getEngagements(action: any) {
  const { payload } = action;
  const { query, resourceId } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getEngagements,
      baseUrl,
      query,
      resourceId
    );

    yield put(toggleGetEngagementsSuccess({ ...response }));

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

    yield put(toggleGetEngagementsFailure({ statusCode, statusText }));
  }
}

export function* watchgetEngagements() {
  yield takeLatest(requestTypes.GET_ENGAGEMENTS_REQUEST, getEngagements);
}
