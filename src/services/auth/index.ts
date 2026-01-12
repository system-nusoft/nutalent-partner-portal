import ENDPOINTS from "src/constants/end-points";
import { RESPONSE_TYPES } from "../../constants/response-types";
import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";
import { LocalStorageService } from "../local-storage";

const localStorageService = new LocalStorageService();
export class AuthService extends HttpService {
  signOut = async (_baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.post(_baseAuthUrl + ENDPOINTS.SIGNOUT);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };

  signIn = async (
    _baseAuthUrl: string,
    data: Record<string, any>
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(_baseAuthUrl + ENDPOINTS.LOGIN, data);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };

  signUp = async (baseUrl: string, data: Record<string, any>): Promise<any> => {
    try {
      const apiResponse = await this.post(`${baseUrl}/sign-up`, data);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
}
