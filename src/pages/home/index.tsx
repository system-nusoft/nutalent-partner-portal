import {
  Avatar,
  Empty,
  Flex,
  Skeleton,
  Space,
  Spin,
  Table,
  Tabs,
  TabsProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { ApexOptions } from "apexcharts";
import { Button, ChaiiText, StatusTag } from "nusoft_components";
import { useEffect, useLayoutEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InterviewWidgetIcon } from "src/assets/svg";
import { limit } from "src/constants/end-points";
import { ROUTES } from "src/constants/navigation-routes";
import { INVOICES_STATUS, TIMESHEET_STATUS } from "src/constants/roles";
import { isPartner } from "src/services/user-type";
import { getGreeting } from "src/store/selectors/features/app";
import { getUsername } from "src/store/selectors/features/authentication";
import {
  adminDashboardLoading,
  getAdminDashboardData,
} from "src/store/selectors/features/dashboard-admin-data";
import {
  dashboardDataLoading,
  getDashboardData,
} from "src/store/selectors/features/dashboard-data";
import { dashboardResourceHoursDataLoading } from "src/store/selectors/features/dashboard-resource-hours";
import { dashboardRevenueDataLoading } from "src/store/selectors/features/dashoard-revenue-data";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import {
  getInterviewList,
  getInterviewMeta,
  interviewLoading,
} from "src/store/selectors/features/interview-selector";
import {
  getInvoicesList,
  invoicesLoading,
} from "src/store/selectors/features/invoices-selector";
import {
  getTimesheetData,
  getTimesheetLoading,
} from "src/store/selectors/features/timesheet-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { chartColorsList } from "src/styles/colors";
import { dateFormat } from "src/utils/functions";
import styles from "./home-styles.module.scss";

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useSelector(adminDashboardLoading);
  const isLoadingPartner = useSelector(dashboardDataLoading);
  const dashboardData: any = useSelector(getAdminDashboardData);
  const dashboardPartnerData: any = useSelector(getDashboardData);
  const timesheetListing: any = useSelector(getTimesheetData);
  const user: any = useSelector(getCurrentUserData);
  const username = useSelector(getUsername);
  const dispatch = useDispatch();
  const isFetchingInterview = useSelector(interviewLoading);
  const invoicesListing = useSelector(getInvoicesList);
  const isFetchingInvoices = useSelector(invoicesLoading);
  const fetchingResourcesHours = useSelector(dashboardResourceHoursDataLoading);
  const isFetchingTimesheet = useSelector(getTimesheetLoading);
  const isFetchingRevenueChart = useSelector(dashboardRevenueDataLoading);
  const monthData = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augest",
    "September",
    "October",
    "November",
    "December",
  ];

  const arr = isPartner()
    ? dashboardPartnerData?.totalResourcesHiredBySkills
    : dashboardData?.totalResourcesHiredBySkills;
  const result = monthData.map((month) => {
    const skillEntry = arr?.find((entry: any) => month === entry?.month);
    return skillEntry ? skillEntry?.total : 0;
  });

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [{ name: "", data: result }],

    options: {
      chart: {
        type: "area", // Valid chart type
        height: 350,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        max: 100,
        min: 0,
        stepSize: 20,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },
  });

  useLayoutEffect(() => {
    if (user) {
      if (user?.partnerId) {
        dispatch(RequestAppAction.handleGetDashoard({ id: user?.partnerId }));
      } else {
        dispatch(RequestAppAction.handleGetDashoardAdmin());
      }
    }
  }, [user]);

  const cards = [
    {
      name: isPartner()
        ? t("heading.totalResources")
        : t("heading.totalRevenue"),
      des: t("text.allTime"),
      value: isPartner()
        ? (dashboardPartnerData?.totalResources ?? 0)
        : t("common.currencySign") + "" + (dashboardData?.totalRevenue ?? 0),
    },
    {
      name: t("heading.totalResources"),
      des: t("text.allTime"),
      value: isPartner()
        ? (dashboardPartnerData?.totalResources ?? 0)
        : (dashboardData?.totalResources ?? 0),
    },
    {
      name: t("heading.totalHiredResources"),
      des: t("text.allTime"),
      value: isPartner()
        ? (dashboardPartnerData?.totalHiredResources?.totalHiredResources ?? 0)
        : (dashboardData?.totalHiredResources ?? 0),
    },
    {
      name: isPartner()
        ? t("heading.pendingInvoices")
        : t("heading.totalPartners"),
      value: isPartner()
        ? t("common.currencySign") +
          "" +
          (dashboardPartnerData?.pendingInvoicesAmount
            ? dashboardPartnerData?.pendingInvoicesAmount
            : 0)
        : (dashboardData?.totalPartners ?? 0),
    },
    {
      name: isPartner()
        ? t("heading.pendingTimesheet")
        : t("heading.totalActiveEngagements"),
      value: isPartner()
        ? (dashboardPartnerData?.pendingTimesheets ?? 0)
        : (dashboardData?.totalActiveEngagements ?? 0),
    },
    {
      name: isPartner() ? t("heading.totalHoursWorked") : t("heading.endUsers"),
      value: isPartner()
        ? `${dashboardPartnerData?.totalHoursWorked ?? 0}h`
        : (dashboardData?.totalUsers ?? 0),
      icon: <InterviewWidgetIcon />,
    },
  ];
  const greeting = useSelector(getGreeting);
  const interviewListing = useSelector(getInterviewList);
  const interviewMeta = useSelector(getInterviewMeta);

  useEffect(() => {
    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data: { page: 1, limit: limit, partnerId: user?.partnerId },
      }),
    );
    dispatch(
      RequestAppAction.handleGetInvoiceList({
        query: { page: 1, limit: limit, payoutStatus: INVOICES_STATUS.PENDING },
      }),
    );
  }, []);
  const InvoicesColumns: any = [
    {
      title: t("table.column.invoice"),
      key: "invoiceNumber",
      dataIndex: "invoiceNumber",
    },
    {
      title: t("table.column.payment"),
      key: "totalAmount",
      dataIndex: "totalAmount",
    },
    {
      title: t("table.column.issueDate"),
      key: "issueDate",
      dataIndex: "issueDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              weekday: "long",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.dueDate"),
      key: "dueDate",
      dataIndex: "dueDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              weekday: "long",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.status"),
      key: "payoutStatus",
      dataIndex: "payoutStatus",
      render: (status: any) => (
        <>{status ? <StatusTag tags={status} /> : "-"}</>
      ),
    },
  ];

  const timesheetColumns: any = [
    {
      title: t("table.column.startDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (val: any) => {
        return val ? <div>{dateFormat(val)}</div> : "-";
      },
    },
    {
      title: t("table.column.endDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (val: any) => {
        return val ? <div>{dateFormat(val)}</div> : "-";
      },
    },
    {
      title: t("table.column.totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val: any) => {
        return val;
      },
    },
    {
      title: t("table.column.totalHours"),
      dataIndex: "totalHours",
      key: "totalHours",
      render: (val: any) => {
        return val;
      },
    },
    {
      title: t("table.column.fixedAmount"),
      dataIndex: "fixedAmount",
      key: "fixedAmount",
      render: (val: any) => {
        return val ? "true" : "false";
      },
    },
    {
      title: t("table.column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: any) => {
        return val ? dateFormat(val) : "-";
      },
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        return (
          <Space size="small">
            <StatusTag tags={status} />
          </Space>
        );
      },
    },
  ];

  const columns: any = [
    {
      title: t("table.column.candidate"),
      key: "resourceFirstName",
      dataIndex: "resourceFirstName",
      width: 140,
      render: (name: string, record: { profilePicture: string }) => (
        <span>
          <Avatar>
            {record?.profilePicture ? (
              <img src={record.profilePicture} />
            ) : (
              name?.charAt(0)
            )}
          </Avatar>{" "}
          {name ? name?.split(" ")[0] : ""}
        </span>
      ),
    },
    {
      title: t("table.column.date"),
      key: "startTime",
      dataIndex: "startTime",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              weekday: "short",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.time"),
      key: "startTime",
      dataIndex: "startTime",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleTimeString("en-US", {
              minute: "2-digit",
              hour: "2-digit",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.action"),
      key: "action",
      align: "start",
      render: (record: any) => (
        <div className="flex">
          <Button
            onClick={() => window.open(record.meetingLink, "_blank")}
            btnClass="actionBtn"
            toolTipLabel={t("button.joinMeeting")}
            icon={
              <img
                className={styles.meet_icon}
                src={require("../../assets/images/meet.png")}
              />
            }
          />
        </div>
      ),
    },
  ];

  const getMonthsArray = (count: number) => {
    const months = [];
    const currentDate = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      months.push(date.toLocaleString("default", { month: "short" }));
    }
    return months;
  };

  const getDaysArray = (days: number) => {
    const daysArray = [];
    const currentDate = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      daysArray.push(
        `${date.getDate()} ${date.toLocaleString("default", {
          month: "short",
        })}`,
      );
    }
    return daysArray;
  };

  useEffect(() => {
    if (dashboardPartnerData?.resourceBreakdownPieChart) {
      updateResourceBreakdownChart();
    }
  }, [dashboardPartnerData]);

  const [totalHoursChartData, setTotalHoursChartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [100],

    options: {
      colors: chartColorsList,
      labels: [""],
      chart: {
        type: "pie",
      },
      stroke: { width: 5 },
      dataLabels: {
        enabled: false,
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              show: false,
            },
          },
        },
      ],

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: getDaysArray(7),
      },
      yaxis: {
        show: false,
      },
      tooltip: { enabled: false },
      legend: {
        position: "right",
        offsetY: 0,
        width: 230,
        offsetX: -80,
        height: 230,
      },
    },
  });
  const [barChartData, setBarChartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [100],

    options: {
      colors: chartColorsList,
      labels: [""],
      chart: {
        type: "pie",
      },
      stroke: { width: 5 },
      dataLabels: {
        enabled: false,
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              show: false,
            },
          },
        },
      ],

      xaxis: {
        type: "category", // Specify type as 'datetime' for time-series data
        categories: getDaysArray(7),
      },
      yaxis: {
        show: false,
      },
      tooltip: { enabled: false },
      legend: {
        position: "right",
        offsetY: 0,
        offsetX: -80,
        width: 230,
        height: 230,
      },
    },
  });

  const [selecetedTable, setSelectedTable] = useState("1");
  const updatedInterviewList = Array.isArray(interviewListing)
    ? interviewListing?.slice(0, 6)
    : []; //list of interview include only 6
  const updatedTimesheetList = Array.isArray(timesheetListing)
    ? timesheetListing?.slice(0, 5)
    : []; //list of Timesheet including only 9
  const updatedInvoicesList = Array.isArray(invoicesListing)
    ? invoicesListing?.slice(0, 5)
    : []; //list of invoices including only 9

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "7 Days",
    },
    {
      key: "2",
      label: "30 Days",
    },
    {
      key: "3",
      label: "3 Months",
      animated: true,
    },
    {
      key: "4",
      label: "12 Months",
    },
  ];
  const interviewItems: TabsProps["items"] = [
    {
      key: "1",
      label: "7 Days",
    },
    {
      key: "2",
      label: "15 Days",
    },
    {
      key: "3",
      label: "30 Days",
      animated: true,
    },
  ];
  const itemsTable: TabsProps["items"] = [
    {
      key: "1",
      label: t("heading.invoices"),
    },
    {
      key: "2",
      label: t("heading.timesheet"),
    },
  ];

  const [activeInterviewTab, setActiveInterviewTab] = useState("1");
  const [topPerformersNotFound, setTopPerformersNotFound] = useState(false);

  const updateTotalHoursChart = (val: string) => {
    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: val, // Current date as ISO string
    };

    // Only call resource hours API for partners
    if (isPartner() && user?.partnerId) {
      dispatch(
        RequestAppAction.handleGetDashboardResourceHoursChart({
          id: user?.partnerId,
          data: { startDate: range.endDate, endDate: range.startDate },
          cbSuccess: (res) => {
            if (res?.labels?.length > 0) {
              setTotalHoursChartData((pre) => ({
                ...pre,
                series: res?.values?.length > 0 ? res?.values : [100],
                options: {
                  ...pre.options,
                  tooltip: { enabled: true },
                  labels: res?.labels?.length > 0 ? res?.labels : [""],
                },
              }));
              setTopPerformersNotFound(false);
            } else {
              setTopPerformersNotFound(true);
            }
          },
        }),
      );
    }
  };

  const [resourceBreakdownNotFound, setResourceBreakdownNotFound] =
    useState(false);
  const updateResourceBreakdownChart = () => {
    const values = dashboardPartnerData?.resourceBreakdownPieChart?.values;
    const labels = dashboardPartnerData?.resourceBreakdownPieChart?.labels;
    if (Array.isArray(labels) && labels?.length > 0) {
      if (Array.isArray(values) && values?.length > 0) {
        setBarChartData((pre) => ({
          ...pre,
          series: values ?? [],
          options: {
            ...pre.options,
            tooltip: { enabled: true },
            labels: labels,
          },
        }));
        setResourceBreakdownNotFound(false);
      }
    } else {
      setResourceBreakdownNotFound(true);
    }
  };
  const switchTotalHoursTab = (key: string) => {
    // Only switch total hours tabs for partners
    if (!isPartner()) return;

    switch (key) {
      case "1":
        updateTotalHoursChart(createDate(7, "day"));
        break;
      case "2":
        updateTotalHoursChart(createDate(30, "day"));
        break;
      case "3":
        updateTotalHoursChart(createDate(3, "month"));
        break;
      case "4":
        updateTotalHoursChart(createDate(12, "month"));
        break;

      default:
        updateTotalHoursChart(createDate(12, "day"));
        break;
    }
  };

  const createDate = (number: number, type: "month" | "day") => {
    const date = new Date(); // Current date
    if (type === "month") {
      date.setMonth(date.getMonth() - number); // Subtract months
    } else if (type === "day") {
      date.setDate(date.getDate() - number); // Subtract days
    }
    return date.toISOString(); // Return ISO string
  };

  const addDate = (number: number, type: "month" | "day") => {
    const date = new Date(); // Current date
    if (type === "month") {
      date.setMonth(date.getMonth() + number); // Subtract months
    } else if (type === "day") {
      date.setDate(date.getDate() + number); // Subtract days
    }
    return date.toISOString(); // Return ISO string
  };

  const fetchInterviewList = () => {
    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: new Date().toISOString(), // Current date as ISO string
    };

    switch (activeInterviewTab) {
      case "1":
        range.endDate = addDate(7, "day");
        break;
      case "2":
        range.endDate = addDate(15, "day");

        break;
      case "3":
        range.endDate = addDate(30, "day");

        break;
      default:
        break;
    }

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data: {
          startTime: range.startDate,
          endTime: range.endDate,
          partnerId: user?.partnerId,
        },
      }),
    );
  };
  useEffect(() => {
    fetchInterviewList();
  }, [activeInterviewTab]);

  const handleTimelineChange = (
    key: string,
    chartData: { name: string; data: number[] },
  ) => {
    let newCategories: string[] = [];

    switch (key) {
      case "1":
        newCategories = getDaysArray(7);

        break;
      case "2":
        newCategories = getDaysArray(30);

        break;
      case "3":
        newCategories = getMonthsArray(3);

        break;
      case "4":
        newCategories = getMonthsArray(12);

        break;
      default:
        break;
    }

    setTimeout(() => {
      setChartData((prev) => ({
        ...prev,
        series: [{ ...prev.series[0], data: chartData?.data }],
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: newCategories },
        },
      }));
    }, 200);
  };

  const fetchRevenueChart = (key: string) => {
    // Don't fetch if user data is not available
    if (!user) {
      return;
    }

    let range = {
      startDate: new Date().toISOString(), // Current date as ISO string
      endDate: new Date().toISOString(), // Current date as ISO string
    };

    switch (key) {
      case "1":
        // 12 month start backward from today
        range.endDate = createDate(7, "day");
        break;
      case "2":
        range.endDate = createDate(30, "day");
        // 3 month start backward from today
        break;
      case "3":
        range.endDate = createDate(3, "month");
        // 30 days start backward from today
        break;
      case "4":
        range.endDate = createDate(12, "month");
        // 7 days start backward from today
        break;

      default:
        break;
    }

    if (isPartner() && user?.partnerId) {
      // Partner-specific revenue data
      dispatch(
        RequestAppAction.handleGetDashboardRevenueChart({
          id: user?.partnerId,
          data: { startDate: range.endDate, endDate: range.startDate },
          cbSuccess: (res) => {
            handleTimelineChange(key, res);
          },
        }),
      );
    } else if (!isPartner()) {
      // SuperAdmin revenue data (platform-wide)
      dispatch(
        RequestAppAction.handleGetAdminDashboardRevenueChart({
          data: { startDate: range.endDate, endDate: range.startDate },
          cbSuccess: (res) => {
            handleTimelineChange(key, res);
          },
        }),
      );
    } else {
    }
  };

  useEffect(() => {
    if (isPartner()) {
      // Partner-specific data fetching
      fetchRevenueChart("1");
      switchTotalHoursTab("1");
      dispatch(
        RequestAppAction.handleGetDashboardTimesheetList({
          id: user?.partnerId,
          data: { status: TIMESHEET_STATUS.PENDING_APPROVAL },
        }),
      );
    } else {
      // SuperAdmin data fetching
      fetchRevenueChart("1");
    }
  }, [user]);

  const createLoadingColumn = () => {
    let customColumn = InvoicesColumns;

    if (selecetedTable === "2") {
      customColumn = timesheetColumns;
    }
    return customColumn.map((col: any) => ({
      ...col,
      render: (value: any, record: any, index: number) =>
        isFetchingTimesheet || isFetchingInvoices ? (
          <Skeleton.Input active block />
        ) : (
          (col.render?.(value, record, index) ?? value)
        ),
    }));
  };
  const createLoadingColumnInterview = () => {
    return columns.map((col: any) => ({
      ...col,
      render: (value: any, record: any, index: number) =>
        isFetchingInterview ? (
          <Skeleton.Input active block />
        ) : (
          (col.render?.(value, record, index) ?? value)
        ),
    }));
  };

  const navigate = useNavigate();

  return (
    <Content className="w-100 d-flex gap-3 flex-column h-100">
      <Flex>
        <ChaiiText className={styles.name_heading}>
          {t(`heading.greeting`, {
            greeting,
            name:
              typeof username === "string"
                ? username.charAt(0).toUpperCase() +
                  username.slice(1, username.length)
                : "",
          })}
        </ChaiiText>
      </Flex>
      <div className="w-100 d-flex  align-items-center justify-content-center">
        <div className="d-flex flex-wrap w-100 gap-3">
          {cards.map(({ name, value }, index) => (
            <div
              id={`${index}`}
              key={index}
              className={`${styles.detailCardStyle} bg-warning d-flex flex-column flex-grow-1`}
            >
              <Content className="p-3 bg-white border border-1 rounded-2 d-flex flex-column flex-grow-1">
                <Content className="mb-2">
                  <ChaiiText className={styles.cardHeading}>{name}</ChaiiText>
                </Content>
                <Flex className="d-flex justify-content-between align-items-center flex-grow-1">
                  <Skeleton
                    paragraph={{ rows: 1 }}
                    title={false}
                    active
                    loading={isLoadingPartner}
                  >
                    <ChaiiText className={styles.cardDescription}>
                      {value}
                    </ChaiiText>
                  </Skeleton>
                </Flex>
              </Content>
            </div>
          ))}
        </div>
      </div>
      <Content className="w-100 p-3 ps-2">
        <div className="d-flex gap-2">
          <div
            className={`p-3 bg-white  ${
              !isPartner() ? "col-12" : "col-8"
            }  rounded-2 border border-1  ${styles.table_height}`}
          >
            <div className="d-flex flex-column">
              <ChaiiText className={styles.heading}>
                {t("heading.revenue")}
              </ChaiiText>
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={(i: any) => {
                  // Only fetch revenue chart if user data is available
                  if (!user) return;

                  fetchRevenueChart(i);
                }}
              />
              <Spin spinning={isFetchingRevenueChart}>
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={350}
                />
              </Spin>
            </div>
          </div>
          <div
            className={`p-3 bg-white  rounded-2 border border-1 col-4 ${
              styles.table_height
            } ${!isPartner() ? "d-none" : undefined}`}
          >
            <div className="d-flex flex-column">
              <div className="d-flex align-items-cetner justify-content-between">
                <span>
                  <ChaiiText className={styles.heading}>
                    {t("heading.upcomingInterviews")}
                  </ChaiiText>
                </span>
                <span>
                  <Button
                    btnClass="whiteBtn"
                    onClick={() => navigate(ROUTES.INTERVIEWS)}
                    label={t("button.viewAll")}
                  />
                </span>
              </div>
              <Tabs
                activeKey={activeInterviewTab}
                items={interviewItems}
                onChange={(i) => {
                  setActiveInterviewTab(i);
                }}
              />

              <Table
                columns={createLoadingColumnInterview()}
                size="small"
                dataSource={
                  isFetchingInterview ? Array(5).fill({}) : updatedInterviewList
                }
                pagination={false}
              />
            </div>
          </div>
        </div>
      </Content>

      {isPartner() ? (
        <div className="d-flex gap-2 me-3 ms-1">
          <div className="col-8  d-flex flex-column gap-2  bg-white border rounded-2 p-3">
            <div className={styles.heading}>
              <div className="flex gap-0 items-center justify-start">
                <div className="pb-0">{t("heading.invoices&timesheet")}</div>
              </div>
              <div className="d-flex">
                <Tabs
                  defaultActiveKey="1"
                  items={itemsTable}
                  onChange={(i) => {
                    setSelectedTable(i);
                  }}
                />
              </div>
            </div>
            <Table
              columns={createLoadingColumn()}
              pagination={false}
              size="middle"
              dataSource={
                isFetchingInvoices || isFetchingTimesheet
                  ? Array(5).fill({})
                  : selecetedTable === "2"
                    ? updatedTimesheetList
                    : updatedInvoicesList
              }
            />
          </div>
          <div className="col-4 gap-2  d-flex flex-column ">
            <div className="p-3 bg-white border rounded-2">
              <div className={styles.heading}>
                <div className="flex gap-0 items-center justify-start">
                  <div className="pb-1">{t("heading.topPerformers")}</div>
                </div>

                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  onChange={(i) => {
                    if (!fetchingResourcesHours) switchTotalHoursTab(i);
                  }}
                />
              </div>
              <div className="flex justify-center items-start">
                <Spin spinning={fetchingResourcesHours}>
                  {topPerformersNotFound ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Chart
                      options={totalHoursChartData.options}
                      series={totalHoursChartData.series}
                      type="pie"
                      height={175}
                    />
                  )}
                </Spin>
              </div>
            </div>
            <div className="p-3 bg-white border rounded-2">
              <div className={styles.heading}>
                <div className="flex gap-3 items-center justify-start">
                  <div className="pb-1">{t("heading.resourceBreakdown")}</div>
                </div>
              </div>
              <div className="flex justify-center items-start">
                <Spin spinning={isLoadingPartner}>
                  {resourceBreakdownNotFound ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Chart
                      options={barChartData.options}
                      series={barChartData.series}
                      type="pie"
                      height={175}
                    />
                  )}
                </Spin>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Content>
  );
};
