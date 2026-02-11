import { Avatar, Spin, Tag } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, SimpleTable } from "nusoft_components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { INTERVIEW_STATUS } from "src/constants/roles";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import {
  getInterviewData,
  interviewLoading,
} from "src/store/selectors/features/interview-selector";
import RequestAppAction from "src/store/slices/app-actions";
import styles from "./styles.module.scss";

interface queryType {
  page: number;
  search?: string;
  status?: INTERVIEW_STATUS;
  limit?: number;
  partnerId: string;
}

export const InterviewListing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const data: any = useSelector(getInterviewData);
  const isLoading = useSelector(interviewLoading);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const user: any = useSelector(getCurrentUserData);
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: t("table.column.resourceName"),
      dataIndex: "resourceFirstName",
      key: "resourceFirstName",

      render: (
        name: string,
        record: { profilePicture: string; resourceLastName: string },
      ) => (
        <span>
          <Avatar>
            {record?.profilePicture ? (
              <img src={record.profilePicture} />
            ) : (
              name?.charAt(0)
            )}
          </Avatar>{" "}
          {record?.resourceLastName
            ? `${name} ${record.resourceLastName}`
            : name}
        </span>
      ),
    },
    {
      title: t("table.column.userName"),
      dataIndex: "userFirstName",
      key: "userFirstName",

      render: (
        _: string,
        record: { userFirstName: string; userLastName: string },
      ) => (
        <span>
          {record?.userFirstName && record?.userLastName
            ? `${record.userFirstName} ${record.userLastName}`
            : "-"}
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
              weekday: "long",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.time"),
      key: "startTime",
      dataIndex: "startTime",
      render: (name: string, record: { endTime: string }) => {
        const date = new Date(name);
        const endDate = new Date(record?.endTime);
        return (
          <span>
            {`${date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })} to ${endDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })} `}
          </span>
        );
      },
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: any) => (
        <>
          {status ? (
            <Tag color="green">
              {status === INTERVIEW_STATUS.BOOKED ? "Scheduled" : status}
            </Tag>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <div className="d-flex align-items-center">
          <Button
            toolTipLabel={t("button.joinMeeting")}
            onClick={() => window.open(record?.meetingLink, "_blank")}
            btnClass="actionBtn"
            icon={
              <img
                src={require("../../assets/images/meet.png")}
                className={`mb-1 ${styles.meet_icon}`}
              />
            }
          />
        </div>
      ),
    },
  ];

  const onChangePage = (e: number) => {
    setPage(e);
    const query: queryType = {
      page: e,
      partnerId: user?.partnerId,
    };
    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data: query,
        cbSuccess: () => {
          setPage(e);
        },
      }),
    );
  };

  const onSearch = (e: string) => {
    setSearch(e);

    const query: queryType = {
      page: 1,
      partnerId: user?.partnerId,
    };

    if (e?.length > 0) query["search"] = e;

    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data: query,
        cbSuccess: () => {
          setPage(1);
        },
      }),
    );
  };

  const fetchResources = () => {
    const query: queryType = {
      page,
      partnerId: user?.partnerId,
    };

    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(RequestAppAction.handleGetInterviewListing({ data: query }));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(INTERVIEW_STATUS).map(([_, value]) => ({
      label: value === INTERVIEW_STATUS.BOOKED ? "Scheduled" : value,
      value: value,
    })),
  ];

  const onChangeStatus = (val: INTERVIEW_STATUS) => {
    const query: queryType = {
      page: 1,
      partnerId: user?.partnerId,
    };
    if (val !== t("status.all")) {
      query["status"] = val;
    }
    dispatch(
      RequestAppAction.handleGetInterviewListing({
        data: query,
        cbSuccess: () => {
          setPage(1);
          setFilterOption(val);
        },
      }),
    );
  };

  return (
    <Spin spinning={isLoading}>
      <SimpleTable
        isLoading={isLoading}
        columns={columns} // Pass the updated columns including checkbox, status, and action
        data={data?.items ?? []} // Provide the data without slicing, allowing for dynamic row numbers
        search={{ onSearch: onSearch, placeholder: t("placeholder.search") }}
        onChangeFilter={onChangeStatus}
        staticHeight
        tableStyle={"middle"}
        pagination={{
          showSizeChanger: false,
          className: "pe-2",
          total: data?.meta?.totalCount,
          current: page,
          onChange: (e: number) => {
            onChangePage(e);
          },
        }}
        sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
      />
    </Spin>
  );
};
