import { combineReducers } from "redux";
import { accountSetupFeatureReducer } from "./account-setup-reducer";
import { dashboardAdminFeatureReducer } from "./admin-dashboard-data";
import { allEngagementsFeatureReducer } from "./all-engagements-reducer";
import { appFeatureReducer } from "./app";
import { authFeatureReducer } from "./authReducer";
import { addResourceFieldsFeatureReducer } from "./create-resource-fields";
import { createResourceFeatureReducer } from "./create-resource-value-reducer";
import { currentUserFeatureReducer } from "./current-user-reducer";
import { dashboardFeatureReducer } from "./dashboard-data";
import { dashboardResourceHoursFeatureReducer } from "./dashboard-resource-hours-data";
import { dashboardRevenueFeatureReducer } from "./dashboard-revenue-data";
import { deleteResourceFeatureReducer } from "./delete-resource-reducer";
import { endUserListingFeatureReducer } from "./end-user-listing-reducer";
import { bookedResourceFeatureReducer } from "./get-booked-resource";
import { getEngagementsFeatureReducer } from "./get-engagements-reducer";
import { favouriteResourceFeatureReducer } from "./get-favourite-resource";
import { partnerFeatureReducer } from "./get-partner";
import { partnersFeatureReducer } from "./get-partners-reducer";
import { getProjectFeatureReducer } from "./get-project-reducer";
import { getResourceByIdFeatureReducer } from "./get-resource-by-id";
import { resourcesFeatureReducer } from "./get-resources-reducer";
import { getSkillsFeatureReducer } from "./get-skills-reducer";
import { inquiresFeatureReducer } from "./inquiries-reducer";
import { interviewFeatureReducer } from "./interview-reducer";
import { inviteEndUserFeatureReducer } from "./invite-end-user.reducer";
import { invitePartnerFeatureReducer } from "./invite-partner-reducer";
import { invoicesFeatureReducer } from "./invoices-reducer";
import { messagesFeatureReducer } from "./messages-reducer";
import { navigatePartnerIdFeatureReducer } from "./navigate-partner-id";
import { partnerStatusFeatureReducer } from "./partner-status-reducer";
import { passwordFeatureReducer } from "./password-reducer";
import { postEducationFeatureReducer } from "./post-education-reducer";
import { experienceFeatureReducer } from "./post-experience-reducer";
import { postResourceFeatureReducer } from "./post-resource-reducer";
import { postSkillFeatureReducer } from "./post-skill-reducer";
import { partnerSettingsFeatureReducer } from "./put-partner-account";
import { resourceByIdFeatureReducer } from "./resource-by-id-reducer";
import { resourceStatusFeatureReducer } from "./resource-status-reducer";
import { signoutFeatureReducer } from "./signout";
import { resumeSocketFeatureReducer } from "./socket-resume-valuse";
import { timeSlotsFeatureReducer } from "./time-slots-reducer";
import { timesheetFeatureReducer } from "./timesheet-reducer";
import { timeZonesFeatureReducer } from "./timezones-reducer";
import { updatePasswordFeatureReducer } from "./update-password-reducer";
import { updateProjectFeatureReducer } from "./update-project-reducer";
import { uploadImageFeatureReducer } from "./upload-image-reducer";
import { uploadResumeFeatureReducer } from "./upload-resume-reducer";
import { verifyPartnerTokenFeatureReducer } from "./verify-partner-token";

const featuresReducer = combineReducers({
  app: appFeatureReducer,
  authentication: authFeatureReducer,
  createResourceValue: createResourceFeatureReducer,
  invitePartner: invitePartnerFeatureReducer,
  verifyPartnerToken: verifyPartnerTokenFeatureReducer,
  accountSetup: accountSetupFeatureReducer,
  currentUser: currentUserFeatureReducer,
  updatePassword: updatePasswordFeatureReducer,
  partner: partnerFeatureReducer,
  image: uploadImageFeatureReducer,
  resources: resourcesFeatureReducer,
  partners: partnersFeatureReducer,
  signout: signoutFeatureReducer,
  engagements: getEngagementsFeatureReducer,
  putPartnerAccountSettings: partnerSettingsFeatureReducer,
  dashboardData: dashboardFeatureReducer,
  adminDashboardData: dashboardAdminFeatureReducer,
  resourceStatus: resourceStatusFeatureReducer,
  partnerStatus: partnerStatusFeatureReducer,
  partnerId: navigatePartnerIdFeatureReducer,
  uploadResume: uploadResumeFeatureReducer,
  resourceById: resourceByIdFeatureReducer,
  experience: experienceFeatureReducer,
  postSkill: postSkillFeatureReducer,
  skills: getSkillsFeatureReducer,
  postEducation: postEducationFeatureReducer,
  addResourceFields: addResourceFieldsFeatureReducer,
  deleteResource: deleteResourceFeatureReducer,
  postResource: postResourceFeatureReducer,
  getResourceById: getResourceByIdFeatureReducer,
  getBookedResource: bookedResourceFeatureReducer,
  getFavouriteResource: favouriteResourceFeatureReducer,
  getProject: getProjectFeatureReducer,
  updateProject: updateProjectFeatureReducer,
  enduserListing: endUserListingFeatureReducer,
  timeSlots: timeSlotsFeatureReducer,
  timeZones: timeZonesFeatureReducer,
  inquiries: inquiresFeatureReducer,
  messages: messagesFeatureReducer,
  interview: interviewFeatureReducer,
  timesheet: timesheetFeatureReducer,
  socketResume: resumeSocketFeatureReducer,
  invoices: invoicesFeatureReducer,
  revenueDashboard: dashboardRevenueFeatureReducer,
  resourceDashboard: dashboardResourceHoursFeatureReducer,
  password: passwordFeatureReducer,
  allEngagements: allEngagementsFeatureReducer,
  inviteEndUser: inviteEndUserFeatureReducer,

  /**
   * More feature reducers will be added here
   */
});

export { featuresReducer };
