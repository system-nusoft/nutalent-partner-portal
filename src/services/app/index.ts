import ENDPOINTS from "src/constants/end-points";
import { RESPONSE_TYPES } from "../../constants/response-types";
import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";

export class AppService extends HttpService {
  fetchAppData = async (baseAuthUrl: string): Promise<any> => {
    try {
      // Example of an API call to fetch the app-data
      // This would be consumed in an async action
      const apiResponse = await this.post(`${baseAuthUrl}app`, undefined);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postInvitePartner = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.INVITE_PARTNER,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postVerifyPartnerToken = async (
    baseAuthUrl: string,
    userId: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.VERIFY_PARTNER_TOKEN(userId),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postAccountSetup = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.ACCOUNT_SETUP,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getCurrentUser = async (baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.get(baseAuthUrl + ENDPOINTS.CURRENT_USER);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  patchUpdatePassword = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        baseAuthUrl + ENDPOINTS.UPDATE_PASSWORD,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getPartner = async (baseAuthUrl: string, id: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_PARTNER(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postUploadImage = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.UPLOAD_IMAGE,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getResources = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_RESOURCES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getPartners = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_PARTNERS,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getEngagements = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_ENGAGEMENTS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  putPartnerAccountSettings = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        baseAuthUrl + ENDPOINTS.PUT_PARTNER_ACCOUNT_SETTINGS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postResetPassword = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.RESET_PASSWORD(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getDashboardData = async (baseAuthUrl: string, id: string): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.DASHBOARD_DATA(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getAdminDashboardData = async (baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.DASHBOARD_DATA_ADMIN
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  patchResourceStatus = async (
    baseAuthUrl: string,
    data: { isActive: boolean },
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        baseAuthUrl + ENDPOINTS.PATCH_RESOURCE_STATUS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  patchPartnerStatus = async (
    baseAuthUrl: string,
    data: { isActive: boolean },
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        baseAuthUrl + ENDPOINTS.PATCH_PARTNER_STATUS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postUploadResume = async (
    baseAuthUrl: string,
    data: FormData
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.UPLOAD_RESUME,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  putResourceById = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        baseAuthUrl + ENDPOINTS.PUT_RESOURCE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postExperience = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.POST_EXPERIENCE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postResourceSkill = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.POST_SKILL(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getSkills = async (baseAuthUrl: string): Promise<any> => {
    try {
      const apiResponse = await this.get(baseAuthUrl + ENDPOINTS.GET_SKILL);

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postEducation = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.POST_EDUCATION(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  deleteResource = async (baseAuthUrl: string, id: string): Promise<any> => {
    try {
      const apiResponse = await this.delete(
        baseAuthUrl + ENDPOINTS.PUT_RESOURCE(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postResource = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.GET_RESOURCES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getResourceById = async (baseAuthUrl: string, id: string): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.PUT_RESOURCE(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getFavouriteResource = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_FAVOURITE_RESOURCE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getBookedResource = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_BOOKED_RESOURCE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getProject = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.GET_PROJECT,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postProject = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.GET_PROJECT,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  putProject = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        baseAuthUrl + ENDPOINTS.PUT_PROJECT(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getEndUserListing = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.END_USERS,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postTimeSlots = async (
    baseAuthUrl: string,
    id: any,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.TIME_SLOT(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postTimeSlotsCostAndAvailablity = async (
    baseAuthUrl: string,
    id: any,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.put(
        baseAuthUrl + ENDPOINTS.TIME_SLOT_DETAILS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getTimeZones = async (): Promise<any> => {
    try {
      const apiResponse = await this.get(ENDPOINTS.TIMEZONES);
      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetMessages = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.GET_MESSAGES(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostMessage = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.SEND_MESSAGE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchReadMessage = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.READ_MESSAGES(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInquires = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INQUIRES,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchInterviewScheduleList = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INTERVIEW,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchTimesheetList = async (
    baseAuthUrl: string,
    id: string,
    query: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET(id),
        query
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostTimesheet = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPostTimesheetRevision = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEETREVISION(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetTimesheetById = async (
    baseAuthUrl: string,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.TIMESHEET_BY_ID(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPatchInvoice = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PATCH_INVOICE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPartnerInvoiceAction = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PARTNER_INVOICE_ACTION(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchAdminInvoiceAction = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.ADMIN_INVOICE_ACTION(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchAdminPayPartner = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PATCH_INVOICE(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInvoicesListing = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INVOICE,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetInvoiceById = async (
    baseAuthUrl: string,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.INVOICE_BY_ID(id)
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetDashboardTimesheetList = async (
    baseAuthUrl: string,
    id: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.DASHBOARD_TIMESHEET_LISTING(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getDashboardRevenueData = async (
    baseAuthUrl: string,
    id: string,
    data: { startDate: string; endDate: string }
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.DASHBOARD_REVENUE_DATA(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getAdminDashboardRevenueData = async (
    baseAuthUrl: string,
    data: { startDate: string; endDate: string }
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.DASHBOARD_REVENUE_DATA_ADMIN,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  getDashboardResourceTotalHoursData = async (
    baseAuthUrl: string,
    id: string,
    data: { startDate: string; endDate: string }
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        baseAuthUrl + ENDPOINTS.DASHBOARD_RESOURCE_HOURS_DATA(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  postForgotPassword = async (
    baseAuthUrl: string,
    email: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.FORGOT_PASSWORD,
        email
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchGetAllEngagement = async (
    baseAuthUrl: string,
    data: any
  ): Promise<any> => {
    try {
      const apiResponse = await this.get(
        `${baseAuthUrl}` + ENDPOINTS.ALL_ENGAGEMENTS(),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
  fetchPatchEngagement = async (
    baseAuthUrl: string,
    data: any,
    id: string
  ): Promise<any> => {
    try {
      const apiResponse = await this.patch(
        `${baseAuthUrl}` + ENDPOINTS.PATCH_ENGAGEMENTS(id),
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
    postInviteEndUser = async (baseAuthUrl: string, data: any): Promise<any> => {
    try {
      const apiResponse = await this.post(
        baseAuthUrl + ENDPOINTS.INVITE_END_USER,
        data
      );

      return prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  };
}
