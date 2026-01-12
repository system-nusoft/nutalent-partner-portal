import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  togglePostSkillFailure,
  togglePostSkillSuccess,
} from "../slices/features/post-skill-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* postSkill(action: any) {
  const { payload } = action;
  const { data, id } = payload;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.postResourceSkill,
      baseUrl,
      data,
      id
    );

    yield put(togglePostSkillSuccess({ ...response }));

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

    yield put(togglePostSkillFailure({ statusCode, statusText }));
  }
}

export function* watchPostSkill() {
  yield takeLatest(requestTypes.POST_SKILL_REQUEST, postSkill);
}
