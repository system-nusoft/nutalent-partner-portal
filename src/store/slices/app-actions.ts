import {
  ENGAGEMENTS_STATUS,
  INTERVIEW_STATUS,
  INVOICES_STATUS,
  PROJECT_FILTER,
  STATUS,
  TIMESHEET_STATUS,
} from "src/constants/roles";
import { requestTypes } from "../types";

class RequestAppAction {
  static handleInvitePartner(payload: {
    data: { companyName: string; recoveryEmail: string; email: string };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.INVITE_PARTNER_REQUEST,
      payload,
    };
  }
  static handleVerifyPartnerToken(payload: {
    token: string;
    userId: string;
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.VERIFY_PARTNER_TOKEN_REQUEST,
      payload,
    };
  }
  static handleAccountSetup(payload: {
    data: {
      firstName: string;
      lastName: string;
      password: string;
      userId: string;
      companyLogo?: string | null;
    };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.ACCOUNT_SETUP_REQUEST,
      payload,
    };
  }
  static handleGetUser(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_CURRENT_USER_REQUEST,
      payload,
    };
  }
  static handleUpdatePassword(payload: {
    currentPassword: string;
    newPassword: string;
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.UPDATE_PASSWORD_REQUEST,
      payload,
    };
  }
  static handleGetPartner(payload: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_PARTNER_REQUEST,
      payload,
    };
  }
  static handleUploadImage(payload: {
    data: any;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.UPLOAD_IMAGE_REQUEST,
      payload,
    };
  }
  static handleGetResources(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      partnerId?: string | null;
      onlyDraftProfiles?: boolean;
      availabilityStatus?: STATUS;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_RESOURCES_REQUEST,
      payload,
    };
  }
  static handleGetPartners(payload?: {
    query?: { page?: number; limit?: number; search?: string };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_PARTNERS_REQUEST,
      payload,
    };
  }
  static handleSignout(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.LOGOUT_REQUEST,
      payload,
    };
  }
  static handleGetEngagements(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
    };
    resourceId: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handlePutPartnerAccountSettings(payload?: {
    data?: {
      commpanyName?: string | undefined;
      name?: string | undefined;
      recoveryEmail?: string | undefined;
      companyLogo?: string | null | undefined;
      websiteURL?: string;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PUT_PARTNER_ACCOUNT_REQUEST,
      payload,
    };
  }
  static handleGetDashoard(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBOARD_DATA_REQUEST,
      payload,
    };
  }
  static handleGetDashoardAdmin(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBORD_ADMIN_DATA_REQUEST,
      payload,
    };
  }
  static handleResourceStatus(payload?: {
    id: string;
    data: { isActive: boolean };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PATCH_RESOURCE_STATUS_REQUEST,
      payload,
    };
  }
  static handlePartnerStatus(payload?: {
    id: string;
    data: { isActive: boolean };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PATCH_PARTNER_STATUS_REQUEST,
      payload,
    };
  }
  static handleUploadResume(payload?: {
    data: any;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.UPLOAD_RESUME_REQUEST,
      payload,
    };
  }
  static handlePutResourceById(payload?: {
    id: string;
    data: any;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PUT_RESOURCE_BY_ID_REQUEST,
      payload,
    };
  }
  static handlePostExperience(payload?: {
    id: string;
    data: any;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_EXPERIENCE_REQUEST,
      payload,
    };
  }
  static handleGetSkills(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_SKILL_REQUEST,
      payload,
    };
  }
  static handlePostSkill(payload?: {
    id: string;
    data: { skills: any[] };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_SKILL_REQUEST,
      payload,
    };
  }
  static handlePostEducation(payload?: {
    id: string;
    data: {
      educationHistory: [
        { certification: string; institute: string; completionDate: string }
      ];
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_EDUCATION_REQUEST,
      payload,
    };
  }
  static handleDeleteResource(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.DELETE_RESOURCE_REQUEST,
      payload,
    };
  }
  static handlePostResource(payload?: {
    data: {
      name?: string;
      title?: string;
      profileSummary?: string;
      age?: string;
      gender?: string;
      email?: string;
      phoneNo?: string;
      profilePicture?: string | null;
      hourlyRate?: number;
      timeSlot?: string;
      availableFrom?: Date;
      resume?: string;
      workMode?: {};
      employmentType?: {};
      partnerId: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_RESOURCE_REQUEST,
      payload,
    };
  }
  static handleGetResourceById(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_RESOURCE_BY_ID_REQUEST,
      payload,
    };
  }
  static handleGetBookedResources(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_BOOKED_RESOURCE_REQUEST,
      payload,
    };
  }
  static handleGetFavouriteResources(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_FAVOURITE_RESOURCE_REQUEST,
      payload,
    };
  }
  static handleGetProject(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: PROJECT_FILTER;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_PROJECT_REQUEST,
      payload,
    };
  }
  static handlePostProject(payload?: {
    data: {
      name: string;
      summary: string;
      startDate: string;
      endDate: string;
      resourceEngagementIds?: [string];
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_PROJECT_REQUEST,
      payload,
    };
  }
  static handlePutProject(payload?: {
    id: string;
    data: {
      name?: string;
      summary?: string;
      startDate?: string;
      endDate?: string;
      resourceEngagementIds?: [string];
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PUT_PROJECT_REQUEST,
      payload,
    };
  }
  static handleGetEndUserListing(payload?: {
    query?: {
      page?: number;
      limit?: number;
      search?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.END_USER_LISTING_REQUEST,
      payload,
    };
  }
  static handleGetTimeSlots(payload?: {
    data?: {
      duration?: number;
      startTime?: string | Date | null;
      endTime?: string | Date | null;
      days?: string;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.TIME_SLOTS_REQUEST,
      payload,
    };
  }
  static handlePostTimeSlots(payload?: {
    data: {
      slots: any[];
      startTime: any;
      endTime: any;
      availableFrom: Date;
      hourlyRate: number;
      duration: number;
      days: string[];
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_TIME_SLOTS_REQUEST,
      payload,
    };
  }
  static handleSendMessage(payload?: {
    data?: {
      resourceId?: string;
      content?: string;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_MESSAGE_REQUEST,
      payload,
    };
  }
  static handleReadMessage(payload?: {
    data?: {
      resourceId: string;
      content?: string;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.READ_MESSAGE_REQUEST,
      payload,
    };
  }
  static handleGetMessages(payload?: {
    data?: {
      page: number;
      limit?: number;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_MESSAGES_REQUEST,
      payload,
    };
  }
  static handleGetInquires(payload?: {
    query?: {
      page: number;
      limit?: number;
      resourceId?: string;
      search?: string;
      endUserId?: string;
      partnerId?: string;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_INQUIRES_REQUEST,
      payload,
    };
  }
  static handleGetInterviewListing(payload?: {
    data?: {
      startTime?: string | Date;
      endTime?: string | Date;
      resourceId?: string;
      partnerId: string;
      userId?: string;
      page?: number;
      search?: string;
      limit?: number;
      status?: INTERVIEW_STATUS;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_INTERVIEWS_REQUEST,
      payload,
    };
  }
  static handleGetTimeZones(payload?: {
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_TIME_ZONES_REQUEST,
      payload,
    };
  }
  static handleGetInvoicesListng(payload?: {
    data?: {
      page: number;
      limit?: number;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_INVOICES_LISTING_REQUEST,
      payload,
    };
  }
  static handleGetTimesheetListing(payload?: {
    query?: {
      page?: number;
      search?: string;
      limit?: number;
      status?: TIMESHEET_STATUS;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_TIMESHEETS_LISTING_REQUEST,
      payload,
    };
  }
  static handleGetTimesheetById(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_TIMESHEETS_BY_ID_REQUEST,
      payload,
    };
  }
  static handleCreateTimesheet(payload?: {
    data: { startDate: Date; endDate: Date };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_TIMESHEETS_REQUEST,
      payload,
    };
  }
  static handleTimesheetRevision(payload?: {
    data: {
      details: {
        date: any;
        hours: number;
        workNotes: string;
      }[];
      notes: any;
      totalAmount: any;
      fixedAmount?: boolean;
      status?: TIMESHEET_STATUS;
    };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.POST_TIMESHEETS_REVISION_REQUEST,
      payload,
    };
  }
  static handlePatchInvoiceStatus(payload?: {
    data: { status: "Pending" | "Paid" };
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PATCH_INVOICE_REQUEST,
      payload,
    };
  }
  static handleGetInvoiceList(payload?: {
    query: {
      page: number;
      limit?: number;
      search?: string | undefined;
      payoutStatus?: INVOICES_STATUS;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_INVOICES_LISTING_REQUEST,
      payload,
    };
  }
  static handleGetInvoiceById(payload?: {
    id: string;
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_INVOICES_BY_ID_REQUEST,
      payload,
    };
  }
  static handlePartnerInvoiceAction(payload: {
    id: string;
    data: { action: "Pay" | "Decline" };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PARTNER_INVOICE_ACTION_REQUEST,
      payload,
    };
  }
  static handleGetDashboardTimesheetList(payload?: {
    id: string;
    data: { status: TIMESHEET_STATUS };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBOARD_TIMESHEETS_REQUEST,
      payload,
    };
  }
  static handleGetDashboardRevenueChart(payload?: {
    id: string;
    data: { startDate: string; endDate: string };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBOARD_REVENUE_REQUEST,
      payload,
    };
  }
  static handleGetAdminDashboardRevenueChart(payload?: {
    data: { startDate: string; endDate: string };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBOARD_REVENUE_ADMIN_REQUEST,
      payload,
    };
  }
  static handleGetDashboardResourceHoursChart(payload?: {
    id: string;
    data: { startDate: string; endDate: string };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_DASHBOARD_RESOURCE_HOURS_REQUEST,
      payload,
    };
  }
  static handleGetAllEngagements(payload?: {
    data: {
      page?: number;
      search?: string;
      hiringStatus?: ENGAGEMENTS_STATUS;
      limit?: number;
    };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.GET_ALL_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handlePatchEngagement(payload?: {
    id: string;
    data: { hiringStatus: ENGAGEMENTS_STATUS };
    cbSuccess?: (res: any) => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.PATCH_ALL_ENGAGEMENTS_REQUEST,
      payload,
    };
  }
  static handleInviteEndUser(payload: {
    data: { email: string };
    cbSuccess?: () => void;
    cbFailure?: (mes: string) => void;
  }) {
    return {
      type: requestTypes.INVITE_END_USER_REQUEST,
      payload,
    };
  }
}

export default RequestAppAction;
