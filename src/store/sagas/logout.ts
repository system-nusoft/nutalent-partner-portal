import { call, put, takeLatest } from "redux-saga/effects";
import { Notification } from "src/components/notification";
import { AuthService } from "src/services/auth";
import { LocalStorageService } from "src/services/local-storage";
import { toggleClearAccountSetup } from "../slices/features/account-setup-reducer";
import { toggleClearDashboardAdmin } from "../slices/features/admin-dashboard-data";
import { toggleClearLogin } from "../slices/features/authReducer";
import { toggleClearCreateResourceData } from "../slices/features/create-resource-value-reducer";
import { toggleClearCurrentUser } from "../slices/features/current-user-reducer";
import { toggleClearGetDashboardData } from "../slices/features/dashboard-data";
import { toggleClearGetPartner } from "../slices/features/get-partner";
import { toggleClearGetPartners } from "../slices/features/get-partners-reducer";
import { toggleClearGetResources } from "../slices/features/get-resources-reducer";
import { toggleClearInvitePartner } from "../slices/features/invite-partner-reducer";
import {
  toggleSignoutFailure,
  toggleSignoutSuccess,
} from "../slices/features/signout";
import { toggleClearUploadimage } from "../slices/features/upload-image-reducer";
import { requestTypes } from "../types";

const appService = new AuthService();
const localStorageService = new LocalStorageService();

function* toggleLogout(action: any) {
  const { payload } = action;

  try {
    const baseUrl: any = process.env.REACT_APP_BASE_URL;

    // const response: AxiosResponse<any> = yield call(
    //   appService.signOut,
    //   baseUrl
    // );

    yield put(toggleSignoutSuccess(null));
    yield put(toggleClearAccountSetup());
    yield put(toggleClearCreateResourceData());
    yield put(toggleClearCurrentUser());
    yield put(toggleClearGetPartner());
    yield put(toggleClearGetPartners());
    yield put(toggleClearGetResources());
    yield put(toggleClearInvitePartner());
    yield put(toggleClearLogin());
    yield put(toggleClearUploadimage());
    // yield put(toggleClear());
    yield put(toggleClearDashboardAdmin());
    yield put(toggleClearGetDashboardData());

    yield call(localStorageService.remove, "user");
    payload?.cbSuccess && payload?.cbSuccess();
  } catch (errors: any) {
    const { statusCode, statusText, message } = errors?.data?.errors;

    Notification({ type: "error", message: message });

    payload?.cbFailure && payload?.cbFailure(message);

    yield put(toggleSignoutFailure({ statusCode, statusText }));
  }
}

export function* watchSignout() {
  yield takeLatest(requestTypes.LOGOUT_REQUEST, toggleLogout);
}
