import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AppService } from "src/services/app";
import {
  toggleGetSkillsFailure,
  toggleGetSkillsSuccess,
} from "../slices/features/get-skills-reducer";
import { requestTypes } from "../types";

const appService = new AppService();

function* getSkill(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    const response: AxiosResponse<any> = yield call(
      appService.getSkills,
      baseUrl
    );

    yield put(toggleGetSkillsSuccess({ ...response }));

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

    yield put(toggleGetSkillsFailure({ statusCode, statusText }));
  }
}

export function* watchGetSkill() {
  yield takeLatest(requestTypes.GET_SKILL_REQUEST, getSkill);
}
