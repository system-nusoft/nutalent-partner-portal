import { DatePicker, Form, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import {
  Button,
  ChaiiText,
  Modal,
  SimpleTable,
  StatusTag,
} from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "src/components/notification";
import { limit } from "src/constants/end-points";
import { ROUTES } from "src/constants/navigation-routes";
import { TIMESHEET_STATUS } from "src/constants/roles";
import {
  getTimesheetList,
  getTimesheetLoading,
  getTimesheetMeta,
} from "src/store/selectors/features/timesheet-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { dateFormat } from "src/utils/functions";
import styles from "./styles.module.scss";

const { RangePicker } = DatePicker;

interface query {
  page?: number;
  search?: string;
  limit?: number;
  status?: TIMESHEET_STATUS;
}
export const TimesheetListing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const data: any = useSelector(getTimesheetList); //
  const meta: any = useSelector(getTimesheetMeta); //
  const isLoading: any = useSelector(getTimesheetLoading);
  const [loadingState, setLoadingState] = useState(true);
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const location = useLocation();
  const [search, setSearch] = useState("");
  const pathname = location.pathname;
  const matchResrouceId = pathname.match(/resources\/([^/]+)/);
  const resrouceId = matchResrouceId ? matchResrouceId[1] : null;
  const params = new URLSearchParams(location.search);
  const engId = params.get("engId");
  // const engagementStatus = params.get("status");  for future use to disabled button if engagement closed
  const id = engId || location.state; // engagement id
  const [isCreatingTimesheet, setIsCreatingTimesheet] = useState(false);

  const columns: any = [
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
    {
      title: t("table.column.action"),
      key: "action",
      width: 160,
      render: (
        _: unknown,
        record: {
          status: string;
          id: string;
          startDate: string;
          endDate: string;
        }
      ) => {
        return (
          <div>
            <Button
              btnClass="actionBtn"
              onClick={() => {
                if (resrouceId) {
                  navigate(
                    ROUTES.VIEW_TIMESHEET_BY_ID.replace(":id", resrouceId)
                      .replace(":timeId", record?.id)
                      .concat(`?engId=${id}`),
                    {
                      state: {
                        startDate: record?.startDate,
                        endDate: record?.endDate,
                      },
                    }
                  );
                } else {
                  navigate(
                    ROUTES.VIEW_TIMESHEET_BY_ID_ENGAGMENTS.replace(
                      ":timeId",
                      record?.id
                    ).concat(`?engId=${id}`),
                    {
                      state: {
                        startDate: record?.startDate,
                        endDate: record?.endDate,
                      },
                    }
                  );
                }
              }}
              label={t("button.viewTimesheet")}
            />
          </div>
        );
      },
    },
  ];

  const onChangePage = (e: number) => {
    const query: query = { page: e, limit, search };

    if (filterOption !== "All") {
      query.status = filterOption;
    }
    dispatch(
      RequestAppAction.handleGetTimesheetListing({
        query: { ...query },
        id: id,
        cbFailure: () => {
          setLoadingState(false);
        },
        cbSuccess: () => {
          setPage(e);
          setLoadingState(false);
        },
      })
    );
  };

  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(TIMESHEET_STATUS).map(([_, value]) => ({
      label: value,
      value: value,
    })),
  ];

  const onChange = (value: TIMESHEET_STATUS | "All") => {
    const query: query = { page: 1, limit, search };
    setPage(1);
    if (value !== "All") {
      query.status = value;
    }
    dispatch(
      RequestAppAction.handleGetTimesheetListing({
        query: { ...query },
        id: id,
        cbFailure: () => {
          setLoadingState(false);
        },
        cbSuccess: () => {
          setLoadingState(false);
          setFilterOption(value);
        },
      })
    );
  };

  const onSearch = (val: string) => {
    setSearch(val);
    const query: query = { page, limit, search: val };

    if (filterOption !== "All") {
      query.status = filterOption;
    }
    dispatch(
      RequestAppAction.handleGetTimesheetListing({
        query: { ...query },
        id: id,
        cbFailure: () => {
          setLoadingState(false);
        },
        cbSuccess: () => {
          setLoadingState(false);
        },
      })
    );
    //   search
  };

  useEffect(() => {
    if (id)
      dispatch(
        RequestAppAction.handleGetTimesheetListing({
          query: { page, limit },
          id: id,
          cbFailure: () => {
            setLoadingState(false);
          },
          cbSuccess: () => {
            setLoadingState(false);
          },
        })
      );
    else {
      if (resrouceId) {
        const path = ROUTES.VIEW_ENGAGEMENTS.replace(":id", resrouceId);
        return navigate(path);
      }
    }
  }, []);

  const modalRef = useRef<any>(null);
  const [form] = useForm();
  const onCreateTimesheet = () => {
    setIsCreatingTimesheet(true);
    form // validate if the field is filled
      .validateFields()
      .then(() => {
        const range = form.getFieldValue("range");
        if (range && range.length === 2) {
          const [start, end] = range;
          const difference = dayjs(end).diff(dayjs(start), "day");
          if (difference > 14) {
            setIsCreatingTimesheet(false);
            return Notification({
              type: "error",
              message: t("notification.rangeError"),
            });
          } else {
            if (id && Array.isArray(range) && range?.length > 1)
              // the id will always be there but just in case check if the engagements id is there.
              dispatch(
                RequestAppAction.handleCreateTimesheet({
                  // create timesheet endpoint
                  id: id, // sending engagements id
                  data: {
                    startDate: dayjs(range[0])
                      .add(1, "day")
                      .hour(0)
                      .minute(0)
                      .second(0)
                      .toDate(), // :00:00:00
                    endDate: dayjs(range[1])
                      .hour(23)
                      .minute(59)
                      .second(59)
                      .toDate(), // 23:59:59
                  }, // start and end date
                  cbSuccess: (res) => {
                    // TODO : due to timesheet status draft condition on BE timesheet cannot me updated until status goes to pending
                    const timesheetId = res?.data?.id; // getting timesheet id from response of the api
                    setIsCreatingTimesheet(false);
                    if (resrouceId && id) {
                      // check if the the resrouce id and engagements id exists
                      const path = ROUTES.VIEW_TIMESHEET_BY_ID.replace(
                        ":id",
                        resrouceId
                      )
                        .replace(":timeId", timesheetId)
                        .concat(`?engId=${id}`);

                      navigate(path, {
                        state: {
                          startDate: res?.data?.startDate,
                          endDate: res?.data?.endDate,
                        },
                      }); // sending start and end date to reuse
                    } else {
                      const path =
                        ROUTES.VIEW_TIMESHEET_BY_ID_ENGAGMENTS.replace(
                          ":timeId",
                          timesheetId
                        ).concat(`?engId=${id}`);
                      navigate(path, {
                        state: {
                          startDate: res?.data?.startDate,
                          endDate: res?.data?.endDate,
                        },
                      }); // sending start and end date to reuse
                    }
                  },
                  cbFailure: () => {
                    setIsCreatingTimesheet(false);
                  },
                })
              );
          }
        } else {
          Notification({ type: "error", message: t("error.rangeRequired") });
          setIsCreatingTimesheet(false);
        }
      })
      .catch(() => {
        setIsCreatingTimesheet(false);
      });
  };

  return (
    <div>
      <Modal
        heading={t("modal.selectDate")}
        ref={modalRef}
        isSpining={isCreatingTimesheet}
        onClose={() => {
          form.resetFields();
          setIsCreatingTimesheet(false);
        }}
        onOk={() => {
          setIsCreatingTimesheet(false);
          onCreateTimesheet();
        }}
        okText={t("button.continue")}
      >
        <Form form={form}>
          <Content className="d-flex gap-4 flex-column">
            <ChaiiText className={styles.modal_desc}>
              {t("modal.selectDateDesc")}
            </ChaiiText>
            <Spin spinning={isCreatingTimesheet}>
              <Form.Item
                rules={[{ required: true, message: t("error.rangeRequired") }]}
                name={"range"}
                className="w-100"
              >
                <RangePicker
                  className="w-100"
                  dropdownClassName={styles.zIndex}
                  minDate={dayjs().subtract(6, "months")}
                  maxDate={dayjs().add(1, "year")}
                />
              </Form.Item>
            </Spin>
          </Content>
        </Form>
      </Modal>
      <SimpleTable
        sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
        onChangeFilter={(val) => onChange(val)}
        staticHeight={true}
        isLoading={loadingState || (isLoading && !isCreatingTimesheet)}
        search={{ onSearch: onSearch, placeholder: t("placeholder.search") }}
        pagination={{
          showSizeChanger: false,
          className: "pe-2",
          total: meta?.totalCount,
          current: page,
          onChange: (e: number) => {
            onChangePage(e);
          },
        }}
        button={{
          label: t("button.createTimesheet"),
          // disabled:
          //   engagementStatus && engagementStatus !== "Active" ? true : false, // for future use to disabled button if engagement closed
          onClick: () => {
            modalRef.current?.openModal();
          },
        }}
        columns={columns}
        data={Array.isArray(data) ? data : []}
      />
    </div>
  );
};
