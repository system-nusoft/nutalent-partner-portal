import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostTimeslotsFailure,
  togglePostTimeslotsSuccess,
} from "../slices/features/time-slots-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postTimeSlotCost(action: any) {
  const { payload } = action;
  const { data, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postTimeSlotsCostAndAvailablity,
      baseUrl,
      id,
      data
    );

    yield put(togglePostTimeslotsSuccess({ ...response }));

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

    yield put(togglePostTimeslotsFailure({ statusCode, statusText }));
  }
}

export function* watchPostTimeSlotsCost() {
  yield takeLatest(requestTypes.POST_TIME_SLOTS_REQUEST, postTimeSlotCost);
}
