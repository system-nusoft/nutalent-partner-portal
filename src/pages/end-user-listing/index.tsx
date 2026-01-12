import { Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { SimpleTable } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import InviteEndUserModal from "src/components/invite-end-user-modal";
import { PrivateRoutes } from "src/constants/routes-types";
import {
  getEndUserListingData,
  getEndUserListingLoading,
} from "src/store/selectors/features/end-user-listing";
import RequestAppAction from "src/store/slices/app-actions";

interface queryType {
  page: number;
  search?: string;
}

export const EndUserListing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const data: any = useSelector(getEndUserListingData);
  const isLoading = useSelector(getEndUserListingLoading);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const inviteModalRef = useRef<any>(null);

  const addNew = () => {
    inviteModalRef.current.openModal();
  };

  const onViewRow = (record: any) => {
    // TODO On click row navigate
    return;
    const path = generatePath(
      PrivateRoutes.PROJECTSBYUSER.replace(":id", record.id)
    );

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 350,
      render: (string: string, record: any) => {
        return <span>{string + " " + record?.lastName}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 450,
    },
    {
      title: "Hired Resources",
      width: 200,
      key: "totalHiredResources",
      dataIndex: "totalHiredResources",
    },
    {
      title: "Favorited Resources",
      width: 200,
      key: "totalFavoritedResources",
      dataIndex: "totalFavoritedResources",
    },
  ];

  const onChangePage = (e: number) => {
    const query: queryType = {
      page: e,
    };
    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(
      RequestAppAction.handleGetEndUserListing({
        query: query,
        cbSuccess: () => {
          setPage(e);
        },
      })
    );
  };

  const onSearch = (e: string) => {
    setSearch(e);

    const query: queryType = {
      page: 1,
    };

    if (e?.length > 0) query["search"] = e;
    dispatch(
      RequestAppAction.handleGetEndUserListing({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      })
    );
  };

  const fetchEndUserListing = () => {
    const query: queryType = {
      page,
    };

    if (search?.length > 0) {
      query["search"] = search;
    }
    dispatch(
      RequestAppAction.handleGetEndUserListing({
        query: query,
      })
    );
  };

  useEffect(() => {
    fetchEndUserListing();
  }, []);

  return (
    <Spin spinning={isLoading}>
      <SimpleTable
        isLoading={isLoading}
        columns={columns} // Pass the updated columns including checkbox, status, and action
        data={data?.items ?? []} // Provide the data without slicing, allowing for dynamic row numbers}
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
        handleRowClick={onViewRow}
        button={{ label: t("button.inviteEndUser"), onClick: addNew }}
      />
      <InviteEndUserModal page={page} search={search} ref={inviteModalRef} />
    </Spin>
  );
};
