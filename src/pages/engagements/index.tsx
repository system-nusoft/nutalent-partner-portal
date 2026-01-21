import { Space } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ClockSideBarIcon } from "src/assets/svg";
import { limit } from "src/constants/end-points";
import { ROUTES } from "src/constants/navigation-routes";
import { ENGAGEMENTS_STATUS } from "src/constants/roles";
import {
  engagementsLoading,
  getEngagementsData,
} from "src/store/selectors/features/get-engagements";
import RequestAppAction from "src/store/slices/app-actions";
import { ClearGetEngagements } from "src/store/slices/features/get-engagements-reducer";
import { dateFormat } from "src/utils/functions";

interface query {
  page?: number;
  limit?: number;
  hiringStatus?: ENGAGEMENTS_STATUS;
  search?: string;
}
export const Engagements: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const data: any = useSelector(getEngagementsData);
  const isLoading: any = useSelector(engagementsLoading);
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/resources\/([^/]+)/);
  const id = match ? match[1] : null;
  const [search, setSearch] = useState("");
  const restrictModalRef = useRef<any>(null);
  const [editId, setEditId] = useState<{
    status: ENGAGEMENTS_STATUS;
    id: string;
  } | null>(null);

  useEffect(() => {
    dispatch(ClearGetEngagements());
    if (id) {
      dispatch(
        RequestAppAction.handleGetEngagements({
          resourceId: id,
          query: { page: page },
        }),
      );
    }
  }, []);

  const columns: any = [
    {
      title: "Resource Name",
      dataIndex: "resource",
      key: "resource",
      render: (val: any) =>
        val?.firstName && val?.lastName
          ? `${val.firstName} ${val.lastName}`
          : "-",
    },
    {
      title: "Employer Name",
      dataIndex: "endUser",
      key: "endUser",
      render: (val: any) =>
        val?.firstName && val?.lastName
          ? `${val.firstName} ${val.lastName}`
          : "-",
    },
    {
      title: t("table.column.projectKickOff"),
      dataIndex: "startedAt",
      key: "startedAt",
      render: (val: any) => {
        return dateFormat(val);
      },
    },
    {
      title: t("table.column.status"),
      key: "hiringStatus",
      dataIndex: "hiringStatus",
      render: (status: string) => {
        return (
          <Space size="small">
            <StatusTag tags={status} />
          </Space>
        );
      },
    },
    {
      title: t("table.column.projectEnded"),
      dataIndex: "endedAt",
      key: "endedAt",
      render: (val: any) => {
        return val ? dateFormat(val) : "-";
      },
    },
    {
      title: t("table.column.action"),
      key: "action",
      render: (
        _: any,
        obj: { id: string; hiringStatus: ENGAGEMENTS_STATUS },
      ) => (
        <div className="d-flex align-items-center">
          <Button
            onClick={() => navigateToTimesheet(obj.id, obj?.hiringStatus)}
            toolTipLabel={t("button.timesheetList")}
            icon={<ClockSideBarIcon />}
            btnClass="actionBtn"
          />
        </div>
      ),
    },
  ];

  const navigateToTimesheet = (
    engagementId: string,
    status: ENGAGEMENTS_STATUS,
  ) => {
    if (id) {
      const path = ROUTES.VIEW_TIMESHEET.replace(":id", id).concat(
        `?engId=${engagementId}&${status}`,
      );
      navigate(path, { state: engagementId });
    }
  };

  const onChangePage = (e: number) => {
    setPage(e);
    const query = {
      page: e,
    };
    if (id)
      dispatch(
        RequestAppAction.handleGetEngagements({
          query: query,
          resourceId: id,
          cbSuccess: () => {
            setPage(e);
          },
        }),
      );
  };
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const navigate = useNavigate();
  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(ENGAGEMENTS_STATUS).map(([_, value]) => ({
      label: value,
      value: value,
    })),
  ];

  const onChange = (value: ENGAGEMENTS_STATUS) => {
    const query: query = {
      search: search,
      page: 1,
      limit,
    };
    setPage(1);
    if (value != t("status.all")) {
      query.hiringStatus = value;
    }
    onFetchData(query, () => setFilterOption(value));
  };

  const onFetchData = (query: query, func?: () => void) => {
    if (id)
      dispatch(
        RequestAppAction.handleGetEngagements({
          query: { ...query },
          resourceId: id,
          cbSuccess: () => {
            if (func) func();
          },
        }),
      );
  };

  return (
    <div>
      <SimpleTable
        search={{
          onSearch: (val) => (
            setSearch(val),
            onFetchData({
              search: val,
              page: page,
              limit: limit,
              hiringStatus: filterOption,
            })
          ),
        }}
        staticHeight
        sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
        onChangeFilter={(val) => onChange(val)}
        pagination={{
          showSizeChanger: false,
          className: "pe-2",
          total: data?.meta?.totalCount,
          current: page,
          onChange: (e: number) => {
            onChangePage(e);
          },
        }}
        isLoading={isLoading}
        columns={columns}
        data={data?.items ?? []}
      />
    </div>
  );
};
