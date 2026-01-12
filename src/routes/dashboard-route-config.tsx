import { HddOutlined } from "@ant-design/icons";
import {
  Account,
  ClockSideBarIcon,
  EndUserSidebarIcon,
  Home,
  InquiresSidebarIcon,
  InterviewSidebarIcon,
  InvoicesSidebarIcon,
  PartnerSidebarIcon,
  ResourceSideBar,
} from "src/assets/svg";
import { ROLES } from "src/constants/roles";
import { AccountSettings } from "src/pages";
import { AddTimesheet } from "src/pages/add-timesheet";
import { AdminPartners } from "src/pages/admin-partners";
import { AllEngagements } from "src/pages/all-engagements";
import EditAdminResource from "src/pages/edit-admin-resource";
import EditPartner from "src/pages/edit-partner";
import { EndUserListing } from "src/pages/end-user-listing";
import { Engagements } from "src/pages/engagements";
import { Inquries as InquiresPage } from "src/pages/inquiries";
import { InterviewListing } from "src/pages/interview-listing";
import { InvoiceById } from "src/pages/invoice-by-id";
import { InvoicesListing } from "src/pages/invoices-listing";
import { PartnerResources } from "src/pages/partner-resources";
import ResourceProfile from "src/pages/resource-profile";
import { TimesheetListing } from "src/pages/timesheet-listing";
import { colors } from "src/styles/colors";
import CreateNewResources from "../pages/create-new-resource";
import { HomePage } from "../pages/home";
import { Resources } from "../pages/resources";

// TODO:
/*
 * 1. Make title optional
 * 2. Make title multi type support ie: (string, node, react element)
 * 3. Add child route support
 * */

export default [
  {
    component: <HomePage />,
    path: "",
    title: "Dashboard",
    label: "Dashboard",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <Home fill={fill} />
    ),
    permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
  },

  {
    component: <Resources />,
    path: "resources",
    title: "Resources",
    label: "Resources",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <ResourceSideBar fill={fill} />
    ),
    permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
    children: [
      {
        component: <Engagements />,
        path: "resources/:id/engagements",
        title: "Engagements",
        label: "Engagements",
        permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
      },
      {
        component: <CreateNewResources />,
        path: "resources/create-new-resource",
        title: "Create new resource",
        label: "Create new resource",
        permission: [ROLES.PARTNER],
      },
      {
        component: <EditAdminResource />,
        path: "resources/:id/edit",
        title: "Resource",
        label: "Resource",
        permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
      },
      {
        component: <ResourceProfile />,
        path: "resources/:id",
        title: "Resource",
        label: "Resource",
        permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
      },
      {
        component: <TimesheetListing />,
        path: "resources/:id/engagements/timesheets",
        title: "Timesheets",
        label: "Timesheets",
        icon: ({ fill = colors.textColor }: { fill: string }) => (
          <ClockSideBarIcon fill={fill} />
        ),
        permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
      },
      {
        component: <AddTimesheet />,
        path: "resources/:id/engagements/timesheets/:id",
        title: "Timesheets",
        label: "Timesheets",
        permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
      },
    ],
  },
  {
    component: <AdminPartners />,
    path: "partners",
    title: "Partners",
    label: "Partners",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <PartnerSidebarIcon fill={fill} />
    ),
    children: [
      {
        component: <PartnerResources />,
        path: "partners/:id/resources",
        title: "Resources",
        label: "Resources",
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <CreateNewResources />,
        path: "partners/:id/resources/create-new-resource",
        title: "Resources",
        label: "Resources",
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <Engagements />,
        path: "partners/:i/resources/:j/engagements",
        title: "Engagements",
        label: "Engagements",
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <EditAdminResource />,
        path: "partners/:i/resources/:j/edit",
        title: "Resource",
        label: "Resource",
        permission: [ROLES.SUPER_ADMIN],
      },

      {
        component: <ResourceProfile />,
        path: "partners/:i/resources/:j",
        title: "Resource",
        label: "Resource",
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <EditPartner />,
        path: "partners/:id",
        title: "Edit partner",
        label: "Edit partner",
        btn: "button.submit",
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <TimesheetListing />,
        path: "partners/:i/resources/:j/engagements/timesheets",
        title: "Timesheets",
        label: "Timesheets",
        icon: ({ fill = colors.textColor }: { fill: string }) => (
          <ClockSideBarIcon fill={fill} />
        ),
        permission: [ROLES.SUPER_ADMIN],
      },
      {
        component: <AddTimesheet />,
        path: "partners/:i/resources/:j/engagements/timesheets/:id",
        title: "Timesheets",
        label: "Timesheets",
        permission: [ROLES.SUPER_ADMIN],
      },
    ],
    permission: [ROLES.SUPER_ADMIN],
  },
  {
    component: <InterviewListing />,
    path: "interviews",
    title: "Interviews",
    label: "Interviews",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <InterviewSidebarIcon fill={fill} />
    ),
    permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
  },
  {
    component: <InvoicesListing />,
    path: "invoices",
    title: "Invoices",
    label: "Invoices",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <InvoicesSidebarIcon fill={fill} />
    ),
    permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
    children: [
      {
        component: <InvoiceById />,
        path: "invoices/:id",
        title: "Invoices",
        label: "Invoices",
        permission: [ROLES.PARTNER, ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    component: <AccountSettings />,
    path: "account",
    title: "Account",
    label: "Account",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <Account fill={fill} />
    ),
    permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
  },
  {
    component: <EndUserListing />,
    path: "end-users",
    title: "End-users",
    label: "End-users",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <EndUserSidebarIcon fill={fill} />
    ),
    permission: [ROLES.SUPER_ADMIN],
  },
  {
    component: <InquiresPage />,
    path: "inquiries",
    title: "Inquiries",
    label: "Inquiries",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <InquiresSidebarIcon fill={fill} />
    ),
    permission: [ROLES.SUPER_ADMIN, ROLES.PARTNER],
  },
  {
    component: <AllEngagements />,
    path: "engagements",
    title: "Engagements",
    label: "Engagements",
    icon: ({ fill = colors.textColor }: { fill: string }) => (
      <HddOutlined style={{ color: fill }} />
    ),
    children: [
      {
        component: <TimesheetListing />,
        path: "engagements/timesheets",
        title: "Timesheets",
        label: "Timesheets",
        permission: [ROLES.PARTNER],
      },
      {
        component: <AddTimesheet />,
        path: "engagements/timesheets/:id",
        title: "Timesheets",
        label: "Timesheets",
        permission: [ROLES.PARTNER],
      },
    ],
    permission: [ROLES.PARTNER],
  },
];
