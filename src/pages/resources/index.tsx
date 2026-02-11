import { RestOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Spin, Tag } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { EditPen, Warning } from "src/assets/svg";
import { ROLES, STATUS } from "src/constants/roles";
import { PrivateRoutes } from "src/constants/routes-types";
import { deleteResourceLoading } from "src/store/selectors/features/delete-resource";
import { getResourceByIdLoading } from "src/store/selectors/features/get-resource-by-id";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import {
  getResourcesData,
  getResourcesLoading,
} from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import {
  toggleClearCreateResourceData,
  toggleCreateResourceData,
} from "src/store/slices/features/create-resource-value-reducer";
import { toggleGetResourcesUpdate } from "src/store/slices/features/get-resources-reducer";
import { colors } from "src/styles/colors";
import {
  dateFormat,
  updateResourceList,
  updateResourceStatus,
} from "src/utils/functions";

interface queryType {
  page: number;
  availabilityStatus?: STATUS;
  isCurrentlyHired?: boolean;
  search?: string;
  onlyDraftProfiles?: boolean;
  partnerId?: string;
}

export const Resources: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const data: any = useSelector(getResourcesData);
  const isLoading = useSelector(getResourcesLoading);
  const isFetchingResource = useSelector(getResourceByIdLoading);
  const restrictModalRef = useRef<any>(null);
  const user: any = useSelector(getCurrentUserData);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [isEditValues, setIsEditValues] = useState<any>(null);
  const [onlyDraftProfiles, setOnlyDraftProfiles] = useState(false);
  const isDeleteing = useSelector(deleteResourceLoading);
  const location = useLocation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteModalRef = useRef<any>(null);
  const isPartner = user?.partnerId;
  const onRestrict = (record: any) => {
    setIsEditValues(record);
    restrictModalRef.current.openModal();
  };

  const onEditRow = (record: any) => {
    dispatch(toggleCreateResourceData(record?.id));
    setTimeout(() => {
      const path = generatePath(
        PrivateRoutes.EDITRESOURCEBYID.replace(":id", record.id),
      );

      navigate(path, {
        state: {
          data: record,
        },
      });
    }, 200);
  };

  const onDeleteRow = (record: any) => {
    dispatch(
      RequestAppAction.handleDeleteResource({
        id: record?.id,
        cbSuccess: () => {
          setDeleteId(null);
          deleteModalRef?.current.closeModal();
          dispatch(
            toggleGetResourcesUpdate({
              ...data,
              items: updateResourceList(data, record?.id),
            }),
          );
        },
        cbFailure: () => {
          setDeleteId(null);
        },
      }),
    );
  };

  const onViewRow = (record: any) => {
    //navigating to resource profile

    navigate(PrivateRoutes.RESOURCE_PROFILE.replace(":id", record?.id), {
      state: {
        data: record,
      },
    });
  };

  const columns = [
    {
      title: t("table.column.name"),
      dataIndex: "firstName",
      key: "firstName",

      render: (string: string, record: any) => {
        return (
          <Space size="small">{string + " " + (record?.lastName ?? "")}</Space>
        );
      },
    },
    {
      title: t("table.column.skills"),
      dataIndex: "skills",
      key: "skills",

      render: (status: string) => {
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className={"text-truncate"}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: t("table.column.hourlyRate"),
      dataIndex: "hourlyRate",
      key: "hourlyRate",

      sorter: (a: { hourlyRate: number }, b: { hourlyRate: number }) =>
        a?.hourlyRate - b?.hourlyRate,
    },
    {
      title: t("table.column.hiringStatus"),

      key: "isCurrentlyHired",
      dataIndex: "isCurrentlyHired",
      render: (status: boolean, record: any) => {
        return (
          <Space size="small">
            {status ? (
              <Tag color="blue">Hired</Tag>
            ) : (
              <StatusTag
                tags={record?.availabilityStatus ?? "Available"}
                color="green"
              />
            )}
          </Space>
        );
      },
    },

    {
      title: t("table.column.onboardingDate"),
      dataIndex: "createdAt",
      key: "createdAt",

      sorter: (a: { startingDate: string }, b: { startingDate: string }) =>
        a?.startingDate?.length - b?.startingDate?.length,
      render: (val: any) => {
        return dateFormat(val);
      },
    },
    {
      title: t("table.column.status"),

      key: "action",
      dataIndex: "action",
      render: (
        _: undefined,
        record: {
          isProfileCompleted: boolean;
          isActive: boolean;
          id: string;
        },
      ) => {
        return (
          <Space size="small">
            {!record?.isProfileCompleted ? (
              <StatusTag tags={"Draft"} />
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  trigger={["click"]}
                  disabled={!record?.isProfileCompleted}
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() =>
                          showRestrictModal(record?.isActive, record)
                        }
                        key="1"
                      >
                        <StatusTag
                          tags={
                            record?.isActive
                              ? t("status.restrict")
                              : t("status.allow")
                          }
                        />
                      </Menu.Item>
                    </Menu>
                  }
                  arrow
                >
                  <span>
                    <StatusTag
                      tags={
                        record?.isActive
                          ? t("status.active")
                          : t("status.restrict")
                      }
                    />
                  </span>
                </Dropdown>
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: t("table.column.action"),
      key: "action",

      render: (_: any, record: any) => (
        <Space size="middle" className="ms-3">
          <span onClick={(e) => (onEditRow(record), e.stopPropagation())}>
            <EditPen />
          </span>
          <Button
            btnClass="actionBtn"
            disabled={record?.isProfileCompleted}
            onClick={(e) => (onClickDelete(record), e.stopPropagation())}
            icon={
              <RestOutlined
                color={colors.black}
                style={{
                  fontSize: "1.2rem",
                  color: record?.isProfileCompleted
                    ? colors.grey
                    : colors.black,
                }}
              />
            }
          />
        </Space>
      ),
    },
  ];

  const onClickDelete = (record: any) => {
    setDeleteId(record);
    deleteModalRef?.current.openModal();
  };

  const updatedColumns = [
    //Add partner column for admin
    ...columns.slice(0, 2),
    {
      title: t("table.column.partner"),
      dataIndex: "partnerName",
      key: "partnerName",
      width: 200,
    },
    ...columns.slice(2),
  ];

  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(STATUS).map(([_, value]) => ({
      label: value,
      value: value,
    })),
  ];

  const onChange = (value: STATUS) => {
    setPage(1);
    setFilterOption(value);
    if (value !== t("status.all")) {
      fetchResources(value);
    } else {
      fetchResources();
    }
  };

  const onChangePage = (e: number) => {
    setPage(e);
    const query: queryType = {
      page: e,
    };
    if (search?.length > 0) {
      query["search"] = search;
    }

    if (filterOption !== t("status.all")) {
      if (filterOption === STATUS.HIRED) {
        query["isCurrentlyHired"] = true;
      } else {
        query["availabilityStatus"] = filterOption;
      }
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }
    if (user.partnerId) {
      query["partnerId"] = user.partnerId;
    }
    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(e);
        },
      }),
    );
  };

  const onSearch = (e: string) => {
    setSearch(e);
    setPage(1);
    const query: queryType = {
      page: 1,
    };

    if (filterOption !== t("status.all")) {
      if (filterOption === STATUS.HIRED) {
        query["isCurrentlyHired"] = true;
      } else {
        query["availabilityStatus"] = filterOption;
      }
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    if (e?.length > 0) query["search"] = e;

    if (user.partnerId) {
      query["partnerId"] = user.partnerId;
    }
    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      }),
    );
  };

  const onChangeStatus = (id: string, value: boolean) => {
    dispatch(
      RequestAppAction.handleResourceStatus({
        id: id,
        data: { isActive: !value },
        cbSuccess: () => {
          setPage(1);
          dispatch(
            toggleGetResourcesUpdate({
              ...data,
              items: updateResourceStatus(data, id, value),
            }),
          );
          restrictModalRef?.current?.closeModal();
        },
      }),
    );
  };

  const showRestrictModal = (isActive: boolean, record: { id: string }) => {
    if (isActive) {
      onRestrict(record);
    } else {
      onChangeStatus(record.id, isActive);
    }
  };

  const fetchResources = (status?: STATUS) => {
    const query: queryType = {
      page: 1,
    };
    if (status) {
      if (status === STATUS.HIRED) {
        query["isCurrentlyHired"] = true;
      } else {
        query["availabilityStatus"] = status;
      }
    }

    if (search?.length > 0) {
      query["search"] = search;
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    if (user.partnerId) {
      query["partnerId"] = user.partnerId;
    }

    dispatch(RequestAppAction.handleGetResources({ query: query }));
  };

  const onChangeDraft = (val: boolean) => {
    setOnlyDraftProfiles(val);
    const query: queryType = {
      page: 1,
    };

    if (val) {
      query["onlyDraftProfiles"] = val;
    }

    if (filterOption !== t("status.all")) {
      if (filterOption === STATUS.HIRED) {
        query["isCurrentlyHired"] = true;
      } else {
        query["availabilityStatus"] = filterOption;
      }
    }

    if (search?.length > 0) {
      query["search"] = search;
    }

    if (user.partnerId) {
      query["partnerId"] = user.partnerId;
    }

    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      }),
    );
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {}, []);

  return (
    <Spin spinning={isLoading || isFetchingResource || isDeleteing}>
      <SimpleTable
        isLoading={isLoading || isDeleteing}
        columns={isPartner ? columns : updatedColumns} // Pass the updated columns including checkbox, status, and action
        data={data?.items ?? []} // Provide the data without slicing, allowing for dynamic row numbers
        heightAdjuster={15}
        tableStyle={"middle"}
        button={
          isPartner
            ? {
                label: t("button.create"),
                buttonClass: "filledBtn",
                onClick: () => (
                  navigate(PrivateRoutes.CREATERESOURCE),
                  dispatch(toggleClearCreateResourceData())
                ),
              }
            : undefined
        }
        sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
        onChangeFilter={(val) => onChange(val)}
        search={{ onSearch: onSearch, placeholder: t("placeholder.search") }}
        toggle={{
          suffix: t("heading.draftProfiles"),
          checkedToggle: onlyDraftProfiles,
          onChangeToggle: (val) => {
            onChangeDraft(val);
          },
        }}
        pagination={{
          showSizeChanger: false,
          className: "pe-2",
          total: data?.meta?.totalCount,
          current: page,
          onChange: (e: number) => {
            onChangePage(e);
          },
        }}
        handleRowClick={onViewRow}
      />
      <Modal
        okText="Yes"
        heading={t("modal.deleteHeading")}
        ref={deleteModalRef}
        headingIcon={<Warning />}
        onClose={() => setDeleteId(null)}
        onOk={() => {
          onDeleteRow(deleteId);
        }}
      >
        {t("modal.deleteResourceParagraph")}
      </Modal>
      <Modal
        okText="Yes"
        heading={t("modal.restrictHeading")}
        ref={restrictModalRef}
        headingIcon={<Warning />}
        onClose={() => setIsEditValues(null)}
        onOk={() => {
          onChangeStatus(isEditValues.id, isEditValues?.isActive);
        }}
      >
        {t("modal.restrictParagraph")}
      </Modal>
    </Spin>
  );
};
