import { all } from "redux-saga/effects";
import { watchAccountSetup } from "./account-setup-saga";
import { watchGetAdmindashboard } from "./admin-dashboard-saga";
import { watchLogin } from "./authentication";
import { watchGetCurrentUser } from "./current-user-saga";
import { watchGetDashboardData } from "./dashboard-saga";
import { watchDeleteResource } from "./delete-resource-saga";
import { watchFetchGetAllEngagements } from "./get-all-engagements-saga";
import { watchGetBookedResource } from "./get-booked-resource-saga";
import { watchGetDashboardTimesheetListing } from "./get-dashboard-timesheet-saga";
import { watchGetEndUserListing } from "./get-end-user-listing-saga";
import { watchgetEngagements } from "./get-engagements-saga";
import { watchGetFavouriteResource } from "./get-favourite-resource-saga";
import { watchGetInquires } from "./get-inquiries-saga";
import { watchGetInterviewList } from "./get-interview-saga";
import { watchGetInvoiceById } from "./get-invoice-by-id-saga";
import { watchGetInvoicesList } from "./get-invoices-list-saga";
import { watchGetMessages } from "./get-messages-saga";
import { watchGetPartner } from "./get-partner-saga";
import { watchPartners } from "./get-partners-saga";
import { watchGetProject } from "./get-project-saga";
import { watchGetResourceById } from "./get-resource-by-id-saga";
import { watchGetResources } from "./get-resources-saga";
import {
  watchGetRevenueDashboard,
  watchGetAdminRevenueDashboard,
} from "./get-revenue-saga";
import { watchGetSkill } from "./get-skills-saga";
import { watchGetTimeZones } from "./get-time-zone";
import { watchGetTimesheetById } from "./get-timesheet-by-id-saga";
import { watchGetTimesheetListing } from "./get-timesheet-listing-saga";
import { watchGetResourceTotalHoursDashboard } from "./get-total-hours-saga";
import { watchInviteEndUser } from "./invite-end-user-saga";
import { watchInvitePartner } from "./invite-partner-saga";
import { watchSignout } from "./logout";
import { watchPatchPartnerStatus } from "./partner-status-saga";
import { watchFetchPatchEngagements } from "./patch-engagement-saga";
import { watchPatchInvoice } from "./patch-invoices-status-saga";
import { watchPartnerInvoiceAction } from "./partner-invoice-action-saga";
import { watchPostEducation } from "./post-education-saga";
import { watchPostExperience } from "./post-experience-saga";
import { watchPostForgotPassword } from "./post-forgot-password-saga";
import { watchPostProject } from "./post-project-saga";
import { watchPostResetPassword } from "./post-reset-password-saga";
import { watchPostResource } from "./post-resource-saga";
import { watchPostSkill } from "./post-skill-saga";
import { watchPostTimeSlotsCost } from "./post-time-slot-saga";
import { watchPostTimesheetRevision } from "./post-timesheet-revision-saga";
import { watchPostTimesheet } from "./post-timesheet-saga";
import { watchPutPartnerAccountSettings } from "./put-partner-account-settings";
import { watchPutProject } from "./put-project-saga";
import { watchPutResourceById } from "./put-resource-by-id-saga";
import { watchReadMessages } from "./read-messages-saga";
import { watchPatchResourceStatus } from "./resource-status-saga";
import { watchPostMessages } from "./send-message-saga";
import { watchPostTimeSlots } from "./time-slot-saga";
import { watchUpdatePassword } from "./update-password-saga";
import { watchUploadImage } from "./upload-image-saga";
import { watchUploadResume } from "./upload-resume-saga";
import { watchVerifyPartnerToken } from "./verify-partner-token-saga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchInvitePartner(),
    watchVerifyPartnerToken(),
    watchAccountSetup(),
    watchGetCurrentUser(),
    watchUpdatePassword(),
    watchGetPartner(),
    watchUploadImage(),
    watchGetResources(),
    watchPartners(),
    watchSignout(),
    watchgetEngagements(),
    watchPutPartnerAccountSettings(),
    watchGetDashboardData(),
    watchGetAdmindashboard(),
    watchPatchResourceStatus(),
    watchPatchPartnerStatus(),
    watchUploadResume(),
    watchPutResourceById(),
    watchPostExperience(),
    watchPostSkill(),
    watchGetSkill(),
    watchPostEducation(),
    watchDeleteResource(),
    watchPostResource(),
    watchGetResourceById(),
    watchGetFavouriteResource(),
    watchGetBookedResource(),
    watchGetProject(),
    watchPutProject(),
    watchPostProject(),
    watchGetEndUserListing(),
    watchPostTimeSlots(),
    watchPostTimeSlotsCost(),
    watchGetTimeZones(),
    watchGetInquires(),
    watchGetMessages(),
    watchPostMessages(),
    watchReadMessages(),
    watchGetInterviewList(),
    watchGetTimesheetListing(),
    watchPostTimesheet(),
    watchGetTimesheetById(),
    watchPostTimesheetRevision(),
    watchGetInvoicesList(),
    watchGetInvoiceById(),
    watchPatchInvoice(),
    watchPartnerInvoiceAction(),
    watchGetDashboardTimesheetListing(),
    watchGetRevenueDashboard(),
    watchGetAdminRevenueDashboard(),
    watchGetResourceTotalHoursDashboard(),
    watchPostForgotPassword(),
    watchFetchPatchEngagements(),
    watchFetchGetAllEngagements(),
    watchPostResetPassword(),
    watchInviteEndUser(),
  ]);
}
