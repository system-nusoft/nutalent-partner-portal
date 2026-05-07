import { Col, Form, Row, Spin, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import { Button, ChaiiText, Modal, SimpleTable } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "src/components/notification";
import { TIMESHEET_STATUS } from "src/constants/roles";
import {
  getTimesheetData,
  getTimesheetLoading,
} from "src/store/selectors/features/timesheet-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { AppService } from "src/services/app";
import { dateFormat } from "src/utils/functions";
import ChaiInput from "../../components/input";
import styles from "./styles.module.scss";

export const AddTimesheet: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const startDate = location?.state?.startDate; //start from date
  const endDate = location?.state?.endDate; // end to Date
  const totalDays = dayjs(endDate).add(1, "day").diff(startDate, "day"); // difference between start and end date
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const timesheetData: any = useSelector(getTimesheetData);
  const onPostLoading = useSelector(getTimesheetLoading);
  const pathname = location.pathname;
  const match = pathname.match(/timesheets\/([^/]+)/);
  const id = match ? match[1] : null;
  const modalRef = useRef<any>(null);
  const [fixedAmount, setFixedAmount] = useState(false);
  const [taskSummary, setTaskSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const status = timesheetData?.status;
  const disable =
    status === TIMESHEET_STATUS.DRAFT || status === TIMESHEET_STATUS.REVISION
      ? false
      : true;
  const arr = Array.from({ length: totalDays }, (_, index) => {
    // creating array with length of total number of days
    const currentDate = dayjs(startDate).add(index, "day"); // Increment the date
    return {
      date: currentDate.format("DD, MMM YYYY"),
      hours: 0,
      workNotes: "",
      amount: 0,
      id: index,
    };
  });
  const hourlyRate = timesheetData?.Engagement?.hourlyRate ?? 0;

  const columns: any = [
    {
      title: t("table.column.date"),
      dataIndex: "date",
      key: "date",
      width: 125,
      render: (val: any) => dateFormat(val) ?? "-",
    },
    {
      title: t("table.column.hours"),
      dataIndex: "hours",
      key: "hours",
      width: 100,
      render: (val: string, obj: { id: number }) => (
        <ChaiInput
          minLength={0}
          disable={disable}
          initialValue={val}
          onChange={(e) => {
            arr?.map((i) => {
              if (i?.id === obj.id) {
                i.hours = e;
                i.amount = e * hourlyRate;
              }
            });

            const totalHours = arr
              .map((_, index) => form.getFieldValue(`hours_${index}`) ?? 0)
              ?.reduce((acc, curr) => acc + curr, 0);
            form.setFieldValue(`amount_${obj.id}`, e * hourlyRate);
            form.setFieldValue(`totalHours`, totalHours);

            if (!fixedAmount) {
              updateTotalAmount();
            }
          }}
          min={0}
          max={24}
          name={`hours_${obj?.id}`}
          inputType="number"
        />
      ),
    },
    {
      title: t("table.column.amount"),
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (val: string, obj: { id: number }) => (
        <ChaiInput
          key={`amount_${obj?.id}`}
          inputType="number"
          disable
          name={`amount_${obj?.id}`}
          initialValue={val}
        />
      ),
    },
    {
      title: t("table.column.workNotes"),
      dataIndex: "startedAt",
      key: "startedAt",
      render: (val: string, obj: { id: number }) => (
        <ChaiInput
          disable={disable}
          key={`hours_${obj?.id}`}
          onChange={(e) => {
            arr?.map((i) => {
              if (i?.id === obj?.id) {
                i.workNotes = e.target.value;
              }
            });
          }}
          name={`workNotes_${obj?.id}`}
          initialValue={val}
        />
      ),
    },
  ];

  useEffect(() => {
    if (id)
      dispatch(
        RequestAppAction.handleGetTimesheetById({
          id: id,
          cbSuccess: (res) => {
            // status if pending or request revision else navigate - 1 condition
            setIsLoading(false);
            const TimesheetRevision = res?.data?.TimesheetRevision;
            const totalAmount = res?.data?.totalAmount;
            const totalHours = res?.data?.totalHours;
            setFixedAmount(res?.data?.fixedAmount);
            form.setFieldValue(`totalAmount`, totalAmount);
            form.setFieldValue(`totalHours`, totalHours);
            if (
              Array.isArray(TimesheetRevision) &&
              TimesheetRevision?.length > 0
            ) {
              TimesheetRevision?.map(
                ({
                  details,
                  notes,
                  taskSummary,
                }: {
                  details: any[];
                  notes: string;
                  taskSummary?: string;
                  totalHours: number;
                  totalAmount: number;
                }) => {
                  form.setFieldValue("notes", notes ?? "");
                  if (typeof taskSummary === 'string' && taskSummary.trim().length > 0) {
                    setTaskSummary(taskSummary.trim());
                  }
                  details?.map(({ hours, amount, workNotes }, index) => {
                    form.setFieldsValue({
                      [`amount_${index}`]: amount,
                      [`hours_${index}`]: hours,
                      [`workNotes_${index}`]: workNotes,
                    });
                  });
                }
              );
            }
          },
          cbFailure: () => {
            setIsLoading(false);
          },
        })
      );
  }, []);

  const updateTotalAmount = () => {
    const totalAmount = arr
      .map((_, index) => form.getFieldValue(`amount_${index}`))
      ?.reduce((acc, curr) => acc + curr, 0);
    form.setFieldValue(`totalAmount`, totalAmount);
  };

  const onChangeSwitch = (value: boolean) => {
    updateTotalAmount();
    setFixedAmount(value);
  };

  const onGenerateTaskSummary = async (): Promise<void> => {
    setIsGeneratingSummary(true);
    
    if (!startDate || !endDate) {
      Notification({
        message: t("error.dateRangeRequired"),
        type: "error",
      });
      setIsGeneratingSummary(false);
      return;
    }

    const workNotes = arr
      .map((_, index) => ({
        date: dayjs(arr[index].date).format("YYYY-MM-DD"),
        workNotes: form.getFieldValue(`workNotes_${index}`) || "",
        hours: Number(form.getFieldValue(`hours_${index}`)) || 0,
      }))
      .filter((item) => item.workNotes?.trim()?.length > 0);

    if (workNotes.length === 0) {
      Notification({
        message: t("error.noWorkNotesAvailable"),
        type: "error",
      });
      setIsGeneratingSummary(false);
      return;
    }

    const baseUrl: string | undefined = process.env.REACT_APP_BASE_URL;
    if (!baseUrl) {
      Notification({
        message: t("error.configurationError"),
        type: "error",
      });
      setIsGeneratingSummary(false);
      return;
    }

    const projectName = timesheetData?.Engagement?.Project?.name ?? "Project";
    const timesheetPeriod = `${dateFormat(startDate)} - ${dateFormat(endDate)}`;

    try {
      const appService = new AppService();
      const response = await appService.postGenerateTaskSummary(baseUrl, {
        workNotes,
        projectName,
        timesheetPeriod,
      });

      const generatedSummary = response.data?.taskSummary ?? "";
      setTaskSummary(generatedSummary);
      form.setFieldValue("taskSummary", generatedSummary);
      Notification({
        message: t("notification.summaryGenerated"),
        type: "success",
      });
    } catch (error: unknown) {
      console.error("AI Summary Generation Error:", error);
      const errorMessage = (error as any)?.data?.message || t("error.summaryGenerationFailed");
      Notification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const onAddRevision = (requestRevision?: boolean): void => {
    const notes = form.getFieldValue("notes") ?? "";
    const totalAmount = form.getFieldValue("totalAmount") ?? 0;
    
    const reqData: {
      details: {
        date: string;
        hours: number;
        workNotes: string;
      }[];
      notes: string;
      totalAmount: number;
      taskSummary?: string;
      fixedAmount?: boolean;
      status?: TIMESHEET_STATUS;
    } = {
      details: arr?.map((i, index) => ({
        date: dayjs(i.date).format("YYYY-MM-DD"),
        hours: Number(form.getFieldValue(`hours_${index}`)) || 0,
        workNotes: form.getFieldValue(`workNotes_${index}`) ?? "",
      })) ?? [],
      notes: notes,
      status: TIMESHEET_STATUS.DRAFT,
      totalAmount: Number(totalAmount) || 0,
    };

    if (taskSummary?.trim()?.length > 0) {
      reqData.taskSummary = taskSummary.trim();
    }

    if (requestRevision) {
      reqData["status"] = TIMESHEET_STATUS.PENDING_APPROVAL;
    }
    if (fixedAmount) {
      reqData["fixedAmount"] = true;
    }
    if (id)
      dispatch(
        RequestAppAction.handleTimesheetRevision({
          id: id,
          data: reqData,
          cbSuccess: () => {
            Notification({
              message: t("notification.success"),
              type: "success",
            });
            navigate(-1);
          },
        })
      );
  };

  return (
    <Spin spinning={isLoading || onPostLoading}>
      <div className="d-flex gap-2">
        <Form requiredMark={false} form={form} className="w-100">
          <div className="pb-3 d-flex gap-2 justify-content-end">
            {status === TIMESHEET_STATUS.DRAFT && (
              <Button
                btnType="button"
                onClick={() => {
                  onAddRevision();
                }}
                label={t("button.saveAsDraft")}
              />
            )}
            {(status === TIMESHEET_STATUS.DRAFT ||
              status === TIMESHEET_STATUS.REVISION) && (
              <Button
                btnType="button"
                onClick={() => {
                  modalRef.current?.openModal();
                }}
                label={t("button.requestReview")}
              />
            )}
          </div>
          <Row gutter={16}>
            <Col span={16}>
              <div className="d-flex flex-column rounded-2 bg-white p-2">
                <SimpleTable
                  isLoading={isLoading}
                  pagination={false}
                  columns={columns}
                  data={arr ?? []}
                />
              </div>
            </Col>
            <Col className="d-flex flex-column gap-2" span={8}>
              <div className={`d-flex rounded-2 bg-white w-100 p-2`}>
                <div className="w-100 h-100">
                  <div className="d-flex align-items-start flex-column gap-2">
                    <div className="d-flex align-items-center justify-content-start w-100">
                      <div className="d-flex flex-row align-items-start justify-content-between gap-3 me-2">
                        <Col>{t("heading.hourlyRateColon")}</Col>
                        <Col>${hourlyRate}</Col>
                      </div>
                    </div>
                    {Array.isArray(timesheetData?.TimesheetRevision) &&
                    timesheetData?.TimesheetRevision[0]?.revision ? (
                      <div className="d-flex flex-row  align-items-start justify-content-between gap-3">
                        <Col>{t("heading.revisionColon")}</Col>
                        <Col className="ms-3">
                          {timesheetData?.TimesheetRevision[0]?.revision}
                        </Col>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="d-flex gap-2 mt-2">
                      <Col className={styles.switch_text}>
                        {t("heading.fixedAmountColon")}
                      </Col>

                      <Switch
                        className="ms-1"
                        disabled={disable}
                        value={fixedAmount}
                        onChange={onChangeSwitch}
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-start w-100">
                      <div className="d-flex flex-column align-items-start justify-content-between gap-3 me-2">
                        <Col>{t("heading.totalHoursColon")}</Col>
                        <Col>{t("heading.totalAmountColon")}</Col>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <Col>
                          <ChaiInput
                            rules={[
                              {
                                required: true,
                                message: t("error.totalHoursRequired"),
                              },
                            ]}
                            name="totalHours"
                            disable
                          />
                        </Col>
                        <Col>
                          <ChaiInput
                            name="totalAmount"
                            onlyNumbers
                            rules={[
                              {
                                required: true,
                                message: t("error.totalAmountRequired"),
                              },
                            ]}
                            disable={!fixedAmount || disable}
                          />
                        </Col>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`d-flex rounded-2 bg-white w-100 ${styles.card}`}>
                <div className="w-100 h-100">
                  <ChaiInput
                    height="small"
                    name="notes"
                    disable={disable}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    inputType="textArea"
                    rows={4}
                    label={t("heading.noteFrom", { name: "Ethan" })}
                  />
                </div>
              </div>
              <div className={`d-flex rounded-2 bg-white w-100 ${styles.card}`}>
                <div className="w-100 h-100 d-flex flex-column p-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <ChaiiText className="fw-bold">
                      {t("heading.taskSummary")}
                    </ChaiiText>
                    {!disable && !taskSummary && (
                      <Button
                        btnType="button"
                        btnClass="actionBtn"
                        onClick={onGenerateTaskSummary}
                        label={t("button.generateAISummary")}
                        disabled={isGeneratingSummary}
                      />
                    )}
                  </div>
                  {taskSummary?.trim()?.length > 0 && (
                    <ChaiInput
                      name="taskSummary"
                      height="small"
                      initialValue={taskSummary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskSummary(e.target.value)}
                      disable={disable}
                      inputType="textArea"
                      rows={4}
                      placeholder={t("placeholder.taskSummary")}
                    />
                  )}
                </div>
              </div>
              {Array.isArray(timesheetData?.TimesheetRevision) &&
              timesheetData?.TimesheetRevision[0]?.comments ? (
                <div
                  className={`d-flex rounded-2 bg-white w-100 ${styles.card}`}
                >
                  <div className="w-100 h-100 d-flex flex-column  p-2">
                    <p>{t("heading.revisionComments")}</p>
                    <p>{timesheetData?.TimesheetRevision[0]?.comments}</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Form>
        <Modal
          heading={t("modal.requestReviewTimesheet")}
          isLoading={false}
          onOk={() => (modalRef.current.closeModal(), onAddRevision(true))}
          okText={t("button.yes")}
          ref={modalRef}
        >
          <ChaiiText className={styles.switch_text}>
            {t("modal.requestReviewTimesheetDesc")}
          </ChaiiText>
        </Modal>
      </div>
    </Spin>
  );
};
