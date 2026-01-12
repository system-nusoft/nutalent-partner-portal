import "bootstrap/dist/css/bootstrap.min.css";
import { Button, SimpleTable, StatusTag } from "nusoft_components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { limit } from "src/constants/end-points";
import { ROUTES } from "src/constants/navigation-routes";
import { INVOICES_STATUS } from "src/constants/roles";
import {
  getInvoicesList,
  getInvoicesMeta,
  invoicesLoading,
} from "src/store/selectors/features/invoices-selector";
import RequestAppAction from "src/store/slices/app-actions";
import styles from "./styles.module.scss";

interface query {
  page: number;
  limit?: number;
  search?: string | undefined;
  payoutStatus?: INVOICES_STATUS;
}
export const InvoicesListing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const data: any = useSelector(getInvoicesList); // will change when api implementation
  const meta: any = useSelector(getInvoicesMeta);
  const isLoading = useSelector(invoicesLoading);
  const [search, setSearch] = useState("");
  const onFetchData = (query: query, func?: () => void) => {
    dispatch(
      RequestAppAction.handleGetInvoiceList({
        query: { ...query },
        cbSuccess: () => {
          if (func) func();
        },
      })
    );
  };

  useEffect(() => {
    onFetchData({ page: page, limit: limit });
  }, []);
  const columns: any = [
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

              weekday: "long",
            })}
          </span>
        );
      },
    },
    {
      title: <>{t("table.column.status")}</>,
      key: "payoutStatus",
      dataIndex: "payoutStatus",
      render: (status: any) => (
        <>{status ? <StatusTag tags={status} /> : "-"}</>
      ),
    },

    {
      title: t("table.column.action"),
      key: "action",
      render: (_: undefined, record: { id: string }) => (
        <>
          <Button
            onClick={() =>
              navigate(ROUTES.INVOICE_BY_ID.replace(":id", record.id))
            }
            btnClass="actionBtn"
            label={t("button.viewInvoice")}
          />
        </>
      ),
    },
  ];

  const onChangePage = (e: number) => {
    const query: query = {
      search: search,
      page: e,
      limit,
    };

    if (filterOption != t("status.all")) {
      query.payoutStatus = filterOption;
    }
    onFetchData(query, () => setPage(e));
  };

  const statusOptions = [
    { label: t("status.all"), value: t("status.all") }, // Add the object at the first position
    ...Object.entries(INVOICES_STATUS).map(([_, value]) => ({
      label: value,
      value: value,
    })),
  ];

  const onChange = (value: INVOICES_STATUS) => {
    const query: query = {
      search: search,
      page: 1,
      limit,
    };
    setPage(1);

    if (value != t("status.all")) {
      query.payoutStatus = value;
    }
    onFetchData(query, () => setFilterOption(value));
  };

  const onSearch = (val: string) => {
    //   search
    setSearch(val);
    const query: query = {
      search: val,
      page: page,
      limit,
    };
    if (filterOption != t("status.all")) {
      query.payoutStatus = filterOption;
    }
    onFetchData(query);
  };

  const [filterOption, setFilterOption] = useState<any>(t("status.all"));

  return (
    <div className="d-flex gap-2 flex-column">
      <div className="bg-white rounded-4 w-100 p-3 ">
        <div className="d-flex gap-5 align-content-center justify-content-start">
          <div className="d-flex gap-2 flex-column">
            <div className={styles.card_mini_heading}>
              {t("heading.incomingFunds")}
            </div>
            <div className={styles.card_desc}>
              ${meta?.pendingAmount ?? "0"}
            </div>
          </div>
          <div className="d-flex gap-2 border border-start ps-5 border-0 flex-column">
            <div className={styles.card_mini_heading}>
              {t("heading.totalFunds")}
            </div>
            <div className={styles.card_desc}>${meta?.paidAmount ?? "0"}</div>
          </div>
        </div>
      </div>
      <div>
        <SimpleTable
          sortBy={{ sortByValue: filterOption, sortByOption: statusOptions }}
          onChangeFilter={(val) => onChange(val)}
          isLoading={isLoading}
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
          columns={columns}
          data={data ?? []}
        />
      </div>
    </div>
  );
};
