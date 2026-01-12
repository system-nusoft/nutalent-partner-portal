import { EditOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { Warning } from "src/assets/svg";
import InvitePartnerModal from "src/components/invite-partner-modal";
import { PrivateRoutes } from "src/constants/routes-types";
import {
  getPartnersData,
  getPartnersLoading,
} from "src/store/selectors/features/get-partners-resources";
import { PartnerStatusLoading } from "src/store/selectors/features/partner-status";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleGetPartnersUpdate } from "src/store/slices/features/get-partners-reducer";
import { toggleSetPartnerId } from "src/store/slices/features/navigate-partner-id";
import { dateFormat, updateResourceStatus } from "src/utils/functions";
import styles from "./adminPartners.module.scss";

export const AdminPartners: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const restrictModalRef = useRef<any>(null);
  const inviteModalRef = useRef<any>(null);
  const data: any = useSelector(getPartnersData);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector(getPartnersLoading);
  const isLoadingStatus = useSelector(PartnerStatusLoading);
  const [isEditValues, setIsEditValues] = useState<any>(null);
  const onRestrict = (record: any) => {
    setIsEditValues(record);
    restrictModalRef.current.openModal();
  };

  const addNew = () => {
    inviteModalRef.current.openModal();
  };

  const onViewRow = (record: any) => {
    const path = generatePath(
      PrivateRoutes.PARTNERRESOURCES.replace(":id", record.id)
    );

    dispatch(toggleSetPartnerId(record?.id));

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onEditRow = (record: any) => {
    const path = generatePath(
      PrivateRoutes.EDITPARTNERBYID.replace(":id", record.id)
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onChangeStatus = (id: string, value: boolean) => {
    dispatch(
      RequestAppAction.handlePartnerStatus({
        id: id,
        data: { isActive: !value },
        cbSuccess: () => {
          setPage(1);
          dispatch(
            toggleGetPartnersUpdate({
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

  const columns = [
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email", //TODO: there should be email instead of recoveryEmail
      key: "email",
      width: 200,
    },
    {
      title: "Hired resources",
      dataIndex: "hiredResources",
      key: "hiredResources",
      width: 200,
      sorter: (a: { hiredResources: number }, b: { hiredResources: number }) =>
        a?.hiredResources - b?.hiredResources,
      render: (_: any, record: any) => record.hiredResources,
    },
    {
      title: "Total resources",
      dataIndex: "totalResources",
      key: "totalResources",
      width: 200,
      sorter: (a: { totalResources: number }, b: { totalResources: number }) =>
        a?.totalResources - b?.totalResources,
      render: (_: any, record: any) => record.totalResources,
    },
    {
      title: "Total revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: 200,
      sorter: (a: { totalRevenue: number }, b: { totalRevenue: number }) =>
        a?.totalRevenue - b?.totalRevenue,
      render: (_: any, record: any) => record.totalRevenue || "-",
    },
    {
      title: "Onboarding date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: { createdOn: number }, b: { createdOn: number }) =>
        a?.createdOn - b?.createdOn,
      render: (val: any) => {
        return dateFormat(val);
      },
    },
    {
      title: "Status",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => showRestrictModal(record?.isActive, record)}
                    key="1"
                  >
                    <StatusTag
                      tags={
                        !record?.isActive
                          ? t("status.allow")
                          : t("status.restrict")
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
                    record?.isActive ? t("status.active") : t("status.restrict")
                  }
                />
              </span>
            </Dropdown>
          </div>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
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

  const onSearch = (e: string) => {
    setSearch(e);
    const query: { page: number; search?: string } = {
      page: 1,
    };

    if (e?.length > 0) query["search"] = e;
    dispatch(
      RequestAppAction.handleGetPartners({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      })
    );
  };

  const onChangePage = (e: number) => {
    setPage(e);
    const query: { page: number; search?: string } = {
      page: e,
    };

    if (search?.length > 0) query["search"] = search;
    dispatch(
      RequestAppAction.handleGetPartners({
        query: query,
        cbSuccess: () => {
          setPage(e);
        },
      })
    );
  };

  const fetchPartners = () => {
    const query = {
      page,
    };
    dispatch(RequestAppAction.handleGetPartners({ query: query }));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <Spin spinning={isLoading || isLoadingStatus}>
      <SimpleTable
        isLoading={isLoading || isLoadingStatus}
        columns={columns}
        data={data?.items ?? []}
        handleRowClick={onViewRow}
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
        button={{ label: t("button.invitePartner"), onClick: addNew }}
      />
      <Modal
        okText="Yes"
        heading={t("modal.restrictHeadingPartner")}
        ref={restrictModalRef}
        isLoading={isLoadingStatus}
        headingIcon={<Warning />}
        onClose={() => setIsEditValues(null)}
        onOk={() => {
          onChangeStatus(isEditValues.id, isEditValues?.isActive);
        }}
      >
        {t("modal.restrictParagraphPartner")}
      </Modal>
      <InvitePartnerModal page={page} search={search} ref={inviteModalRef} />
    </Spin>
  );
};
