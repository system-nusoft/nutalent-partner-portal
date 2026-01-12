import { ExportOutlined } from "@ant-design/icons";
import { Spin, Table, Tag, Tooltip } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "src/constants/navigation-routes";
import { getInvoicesData } from "src/store/selectors/features/invoices-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/styles/colors";
import { returnDateMonthAndYear } from "src/utils/functions";
import styles from "./styles.module.scss";

export const InvoiceById: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const invoice: any = useSelector(getInvoicesData);
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/invoices\/([^/]+)/);
  const id = match ? match[1] : null;

  useEffect(() => {
    if (id)
      dispatch(
        RequestAppAction.handleGetInvoiceById({
          id: id,
          cbFailure: () => {
            // navigate(ROUTES.INVOICES);
          },
        })
      );
  }, []);

  const columns: any[] = [
    {
      title: t("table.column.timeline"),
      key: "startDate",
      dataIndex: "startDate",
      render: (
        name: string,
        record: {
          endDate: string;
          startDate: string;
          resourceId: string;
          engagementId: string;
          id: string;
        }
      ) => {
        const date = new Date(name);
        return (
          <span className="d-flex gap-1">
            {name && record?.endDate
              ? `From ${date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })} To ${new Date(record?.endDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}`
              : "-"}
            <Tooltip color={colors.primary} title={t("button.viewTimesheet")}>
              <ExportOutlined
                className="font-bold cursor-pointer"
                onClick={() => {
                  if (invoice?.Engagements?.resourceId) {
                    navigate(
                      ROUTES.VIEW_TIMESHEET_BY_ID.replace(
                        ":id",
                        invoice?.Engagements?.resourceId
                      )
                        .replace(":timeId", record?.id)
                        .concat(`?engId=${record?.engagementId}`),
                      {
                        state: {
                          startDate: record?.startDate,
                          endDate: record?.endDate,
                        },
                      }
                    );
                  }
                }}
              />
            </Tooltip>
          </span>
        );
      },
    },

    {
      title: t("table.column.totalHours"),
      key: "totalHours",
      dataIndex: "totalHours",
    },
    {
      title: t("table.column.approvedAt"),
      key: "approvedAt",
      dataIndex: "approvedAt",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {name
              ? date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  weekday: "long",
                })
              : "-"}
          </span>
        );
      },
    },
    {
      title: t("table.column.payment"),
      key: "totalAmount",
      dataIndex: "totalAmount",
      width: 120,
    },
  ];
  return (
    <Spin spinning={false}>
      <div className="h-100 w-100">
        <div>
          <div className="bg-white px-4 py-4 mx-5 p-3 rounded-3 d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex flex-column gap-2">
                <div className={styles.card_heading}>
                  {invoice?.invoiceNumber}
                </div>
                <div className={styles.card_desc}>
                  {t("heading.paymentFor", {
                    startDate: returnDateMonthAndYear(
                      `${
                        Array.isArray(invoice?.Timesheet) &&
                        invoice?.Timesheet?.length > 0
                          ? invoice?.Timesheet[0]?.startDate
                          : new Date()
                      }`
                    ), // update in future
                    endDate: returnDateMonthAndYear(
                      `${
                        Array.isArray(invoice?.Timesheet) &&
                        invoice?.Timesheet?.length > 0
                          ? invoice?.Timesheet[invoice?.Timesheet?.length - 1]
                              ?.endDate
                          : new Date()
                      }`
                    ), // update in future
                  })}
                </div>
              </div>
              <div>
                <Tag title="pending" color="pending" />
              </div>
            </div>
            <div className="d-flex gap-5">
              <div className="d-flex flex-column">
                <div className={styles.card_desc}>{t("heading.issueDate")}</div>
                <div className={styles.card_date}>
                  {returnDateMonthAndYear(
                    `${invoice?.issueDate ?? new Date()}`
                  )}
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className={styles.card_desc_brown}>
                  {t("heading.dueDate")}
                </div>
                <div className={styles.card_date}>
                  {returnDateMonthAndYear(`${invoice?.dueDate ?? new Date()}`)}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Table
                dataSource={invoice?.Timesheet ?? []}
                scroll={{ y: `calc(100vh - 32rem)` }}
                columns={columns}
                pagination={false}
              />
            </div>
            <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
              <div className={styles.card_desc}>
                {t("heading.totalAmount")}:
              </div>
              <div className={styles.card_amount}>
                ${invoice?.totalAmount ?? "0"}
              </div>
            </div>
            {/* <div className="d-flex justify-content-end align-items-center gap-3 ">
              <div className={styles.card_desc}>
                {t("heading.nuTalentFee")}:
              </div>
              <div className={styles.card_amount}>
                ${invoice?.nutalentFee ?? "0"}
              </div>
            </div> */}
            {/* <div className="d-flex justify-content-end align-items-center gap-3 ">
              <div className={styles.card_desc}>{t("heading.employerAmount")}:</div>
              <div className={styles.card_amount}>
                ${invoice?.netAmount ?? "0"}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Spin>
  );
};
