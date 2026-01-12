import { Checkbox, Space, Spin } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavourtieResourceData,
  getFavourtieResourceLoading,
} from "src/store/selectors/features/get-favourite-resource";
import RequestAppAction from "src/store/slices/app-actions";

interface queryType {
  page: number;
  search?: string;
}

export const FavouriteResources: React.FC = () => {
  const { t } = useTranslation();
  const data: any = useSelector(getFavourtieResourceData);
  const isLoading = useSelector(getFavourtieResourceLoading);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const onViewRow = (record: any) => {
    // TODO functionality for Booked Resource onClick
    console.log(record);
  };

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 25,
      render: (_: string) => {
        return <Checkbox />;
      },
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 300,
      render: (string: string) => {
        return <Space size="small">{string}</Space>;
      },
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 450,
      render: (status: string) => {
        return <div className={"text-truncate"}>{status}</div>;
      },
    },
    {
      title: "Status",
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
  ];

  const onChangePage = (e: number) => {
    setPage(e);
    const query: queryType = {
      page: e,
    };
    if (search?.length > 0) {
      query["search"] = search;
    }
    dispatch(
      RequestAppAction.handleGetFavouriteResources({
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
      RequestAppAction.handleGetFavouriteResources({
        query: query,
        cbSuccess: () => {
          setPage(1);
        },
      })
    );
  };

  const fetchResources = () => {
    const query: queryType = {
      page,
    };

    if (search?.length > 0) {
      query["search"] = search;
    }

    dispatch(
      RequestAppAction.handleGetFavouriteResources({
        query: query,
      })
    );
  };

  useEffect(() => {
    fetchResources();
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
      />
    </Spin>
  );
};
