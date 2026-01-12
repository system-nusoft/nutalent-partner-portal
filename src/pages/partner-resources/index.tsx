import { Dropdown, Menu, Space, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { EditPen, Warning } from "src/assets/svg";
import { STATUS } from "src/constants/roles";
import { PrivateRoutes } from "src/constants/routes-types";
import { deleteResourceLoading } from "src/store/selectors/features/delete-resource";
import {
  getResourcesData,
  getResourcesLoading,
} from "src/store/selectors/features/resources-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleClearCreateResourceData } from "src/store/slices/features/create-resource-value-reducer";
import { toggleGetResourcesUpdate } from "src/store/slices/features/get-resources-reducer";
import {
  dateFormat,
  updateResourceList,
  updateResourceStatus,
} from "src/utils/functions";

interface queryType {
  page: number;
  partnerId: string | null;
  availabilityStatus?: STATUS;
  search?: string;
  onlyDraftProfiles?: boolean;
}

export const PartnerResources: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const restrictModalRef = useRef<any>(null);
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const [page, setPage] = useState(1);
  const data: any = useSelector(getResourcesData);
  const location = useLocation();
  const dispatch = useDispatch();
  const isDeleteing = useSelector(deleteResourceLoading);
  const [onlyDraftProfiles, setOnlyDraftProfiles] = useState(false);
  const isLoading = useSelector(getResourcesLoading);
  const pathname = location.pathname;
  const match = pathname.match(/partners\/([^/]+)/);
  const partnerId = match ? match[1] : null;
  const [search, setSearch] = useState("");
  const [isEditValues, setIsEditValues] = useState<any>(null);
  const onRestrict = (record: any) => {
    setIsEditValues(record);
    restrictModalRef.current.openModal();
  };

  const onDeleteRow = (record: any) => {
    dispatch(
      RequestAppAction.handleDeleteResource({
        id: record?.id,
        cbSuccess: () => {
          dispatch(
            toggleGetResourcesUpdate({
              ...data,
              items: updateResourceList(data, record?.id),
            })
          );
        },
      })
    );
  };

  const onViewRow = (record: any) => {
    //navigating to resrouce profile
    navigate(
      PrivateRoutes.ADMIN_PARTNER_RESOURCE_PROFILE.replace(
        ":i",
        record?.partnerId
      ).replace(":j", record?.id),
      {
        state: {
          data: record,
        },
      }
    );
  };

  const onEditRow = (record: any) => {
    navigate(location.pathname + `/${record.id}` + "/edit", {
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
      width: 300,
      render: (string: string, record: any) => {
        return (
          <Space size="small">
            {string}
            {!record?.isProfileCompleted && <StatusTag tags={"Draft"} />}
          </Space>
        );
      },
    },
    {
      title: t("table.column.skills"),
      dataIndex: "skills",
      key: "skills",
      width: 350,
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
      width: 150,
      sorter: (a: { hourlyRate: number }, b: { hourlyRate: number }) =>
        a?.hourlyRate - b?.hourlyRate,
    },
    {
      title: t("table.column.hiringStatus"),
      width: 120,
      key: "availabilityStatus",
      dataIndex: "availabilityStatus",
      render: (status: string) => {
        return (
          <Space size="small">
            <StatusTag tags={status} />
          </Space>
        );
      },
    },

    {
      title: t("table.column.onboardingDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a: { startingDate: string }, b: { startingDate: string }) =>
        a?.startingDate?.length - b?.startingDate?.length,
      render: (val: any) => {
        return dateFormat(val);
      },
    },
    {
      title: t("table.column.status"),
      width: 120,
      key: "action",
      dataIndex: "action",
      render: (
        _: undefined,
        record: {
          isProfileCompleted: boolean;
          isActive: boolean;
          id: string;
        }
      ) => {
        return (
          <Space size="small">
            {record?.isProfileCompleted ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  trigger={["click"]}
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
            ) : (
              <>
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusTag
                    onClick={() => {
                      onDeleteRow(record);
                    }}
                    tags={t("status.delete")}
                  />
                </div>
              </>
            )}
          </Space>
        );
      },
    },
    {
      title: t("table.column.action"),
      key: "action",
      width: 160,
      render: (_: any, record: any) => (
        <Space size="middle" className="ms-3">
          <span onClick={(e) => (onEditRow(record), e.stopPropagation())}>
            <EditPen />
          </span>
        </Space>
      ),
    },
  ];
  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(STATUS).map(([_, value]) => ({
      label: value,
      value: value,
    })),
  ];

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
            })
          );
          restrictModalRef?.current?.closeModal();
        },
      })
    );
  };

  const showRestrictModal = (isActive: boolean, record: { id: string }) => {
    if (isActive) {
      onRestrict(record);
    } else {
      onChangeStatus(record.id, isActive);
    }
  };

  const onSearch = (e: string) => {
    setSearch(e);

    const query: queryType = {
      page: 1,
      partnerId: partnerId,
    };

    if (filterOption !== t("status.all")) {
      query["availabilityStatus"] = filterOption;
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    if (e?.length > 0) query["search"] = e;

    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      })
    );
  };

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
      partnerId: partnerId,
    };

    if (filterOption !== t("status.all")) {
      query["availabilityStatus"] = filterOption;
    }
    if (search?.length > 0) {
      query["search"] = search;
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(e);
        },
      })
    );
  };

  const fetchResources = (status?: STATUS) => {
    const query: queryType = {
      page: 1,
      partnerId: partnerId,
    };

    if (status) {
      query["availabilityStatus"] = status;
    }
    if (search?.length > 0) {
      query["search"] = search;
    }

    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    dispatch(RequestAppAction.handleGetResources({ query: query }));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const onChangeDraft = (val: boolean) => {
    setOnlyDraftProfiles(val);
    const query: queryType = {
      page: 1,
      partnerId: partnerId,
    };

    if (val) {
      query["onlyDraftProfiles"] = val;
    }

    if (filterOption !== t("status.all")) {
      query["availabilityStatus"] = filterOption;
    }

    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(
      RequestAppAction.handleGetResources({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      })
    );
  };

  return (
    <Spin spinning={isLoading || isDeleteing}>
      <SimpleTable
        isLoading={isLoading || isDeleteing}
        columns={columns}
        data={data?.items ?? []}
        handleRowClick={onViewRow}
        onChangeFilter={(val) => onChange(val)}
        button={{
          label: t("button.create"),
          buttonClass: "filledBtn",
          onClick: () => {
            if (partnerId)
              return (
                navigate(
                  PrivateRoutes.CREATEPARTNERRESOURCE.replace(":id", partnerId),
                  { state: { data: location.state?.data } }
                ),
                dispatch(toggleClearCreateResourceData())
              );
          },
        }}
        toggle={{
          checkedToggle: onlyDraftProfiles,
          onChangeToggle: onChangeDraft,
          suffix: t("heading.draftProfiles"),
        }}
        search={{ onSearch: onSearch, placeholder: t("placeholder.search") }}
        pagination={{
          showSizeChanger: false,
          className: "pe-2",
          total: data?.meta?.totalCount,
          current: page,
          onChange: (e: number) => {
            onChangePage(e);
          },
        }}
        sortBy={{ sortByOption: statusOptions, sortByValue: filterOption }}
      />
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
