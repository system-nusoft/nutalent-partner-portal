import { EditOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { Warning } from "src/assets/svg";
import { STATUS } from "src/constants/roles";
import { PrivateRoutes } from "src/constants/routes-types";
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
import styles from "./adminResources.module.scss";

interface queryType {
  page: number;
  availabilityStatus?: STATUS;
  search?: string;
  onlyDraftProfiles?: boolean;
}

export const AdminResources: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const restrictModalRef = useRef<any>(null);
  const [filterOption, setFilterOption] = useState<any>(t("status.all"));
  const [page, setPage] = useState(1);
  const data: any = useSelector(getResourcesData);
  const location = useLocation();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [onlyDraftProfiles, setOnlyDraftProfiles] = useState(false);
  const isLoading = useSelector(getResourcesLoading);
  const [isEditValues, setIsEditValues] = useState<any>(null);
  const onRestrict = (record: any) => {
    setIsEditValues(record);
    restrictModalRef.current.openModal();
  };
  const onViewRow = (record: any) => {
    dispatch(toggleClearCreateResourceData());

    if (location.pathname.includes("partners")) {
      const parts = location?.pathname.split("/");
      const path = generatePath(
        PrivateRoutes.PARTNERRESOURCESENGAGEMENTS.replace(
          ":id",
          parts[3]
        ).replace(":j", record.id)
      );

      navigate(path, {
        state: {
          data: record,
        },
      });
    } else {
      navigate(PrivateRoutes.VIEWRESOURCEBYIDADMIN.replace(":id", record?.id), {
        state: {
          data: record,
        },
      });
    }
  };

  const onEditRow = (record: any) => {
    const path = generatePath(
      PrivateRoutes.EDITRESOURCEBYIDADMIN.replace(":id", record.id)
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
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
            })
          );
          restrictModalRef?.current?.closeModal();
        },
      })
    );
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
  const showRestrictModal = (isActive: boolean, record: { id: string }) => {
    if (isActive) {
      onRestrict(record);
    } else {
      onChangeStatus(record.id, isActive);
    }
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
        return <div className={"text-truncate"}>{status}</div>;
      },
    },
    {
      title: "Partner Name",
      dataIndex: "partnerName",
      key: "partnerName",
      width: 200,
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
        <Space size="middle">
          <EditOutlined
            onClick={(e) => (onEditRow(record), e.stopPropagation())}
            className={`${styles.editActionButton}`}
          />
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

    if (filterOption !== t("status.all")) {
      query["availabilityStatus"] = filterOption;
    }
    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    if (search?.length > 0) {
      query["search"] = search;
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
    };

    if (status !== t("status.all")) {
      query["availabilityStatus"] = status;
    }
    if (onlyDraftProfiles) {
      query["onlyDraftProfiles"] = onlyDraftProfiles;
    }

    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(RequestAppAction.handleGetResources({ query: query }));
  };

  const onSearch = (e: string) => {
    setSearch(e);

    const query: queryType = {
      page: 1,
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

  useEffect(() => {
    fetchResources();
  }, []);

  const onChangeDraft = (val: boolean) => {
    setOnlyDraftProfiles(val);
    const query: queryType = {
      page: 1,
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
    <>
      <SimpleTable
        columns={columns}
        isLoading={isLoading}
        data={data?.items ?? []}
        toggle={{
          suffix: t("heading.draftProfiles"),
          checkedToggle: onlyDraftProfiles,
          onChangeToggle: (val) => {
            onChangeDraft(val);
          },
        }}
        handleRowClick={onViewRow}
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
        sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
        search={{ onSearch: onSearch, placeholder: t("placeholder.search") }}
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
    </>
  );
};
