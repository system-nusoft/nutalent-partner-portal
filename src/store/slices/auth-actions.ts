import { requestTypes } from "../types";

class RequestAuthAction {
  static handleLogin(payload: {
    email: string;
    password: string;
    t: any;
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.LOGIN_REQUEST,
      payload,
    };
  }
  static handleForgotPassword(payload: {
    email: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_FORGOT_PASSWORD_REQUEST,
      payload,
    };
  }
  static handleResetPassword(payload: {
    userId: string;
    password: string;
    token: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_RESET_PASSWORD_REQUEST,
      payload,
    };
  }
  static handleVerifyToken(payload: {
    id: string;
    token: string;
    cbSuccess?: (res: unknown) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.VERIFY_PARTNER_TOKEN_REQUEST,
      payload,
    };
  }
}

export default RequestAuthAction;
