import { Col, Form, Row, Spin, Tag, TimePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import moment from "moment-timezone";
import { ChaiiText } from "nusoft_components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getAddResourceFields } from "src/store/selectors/features/add-resource-fields";
import {
  getResourceByIdData,
  getResourceByIdLoading,
} from "src/store/selectors/features/get-resource-by-id";
import { uploadResourceByIdLoading } from "src/store/selectors/features/resource-by-id";
import {
  getTimeSlotData,
  getTimeSlotLoading,
} from "src/store/selectors/features/time-slot-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleClearTimeSlots } from "src/store/slices/features/time-slots-reducer";
import { interviewLimits } from "src/utils/functions";
import { Dropdown } from "../drop-down";
import ChaiInput from "../input";
import { Notification } from "../notification";
import NuDatePicker from "../range-picker-year";
import { TimeRangePicker } from "../time-range-picker";
import WhiteCard from "../white-card";
import styles from "./stlyes.module.scss";
const { RangePicker } = TimePicker;

dayjs.extend(utc);
dayjs.extend(timezone);
interface prop {
  onSuccess: () => void;
}
const CostAndAvailibilty = ({ onSuccess }: prop) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<
    { startTime: string | null | Date; endTime: string | null | Date }[] | []
  >([]);
  const fields = useSelector(getAddResourceFields);
  const isLoading = useSelector(uploadResourceByIdLoading);
  const isLoadingPost = useSelector(getTimeSlotLoading);
  const timeSlotsList: any = useSelector(getTimeSlotData);
  const [timeZones, setTimeZones] = useState<
    { timezone: string; offset: string }[]
  >([]);
  const location = useLocation();
  const pathname = location.pathname;
  const hasEdit = pathname.includes("edit");
  const resourceData: any = useSelector(getResourceByIdData);
  const isLoadingGetResource: any = useSelector(getResourceByIdLoading);

  const getTimezonesWithOffsets = () => {
    const arr = moment.tz.names(); // Get all timezone names
    const allTimeZones = arr.map((tz) => {
      const offsetInMinutes = moment.tz(tz).utcOffset(); // Get offset in minutes
      const hours = Math.floor(Math.abs(offsetInMinutes) / 60)
        .toString()
        .padStart(2, "0");
      const minutes = Math.abs(offsetInMinutes % 60)
        .toString()
        .padStart(2, "0");
      const sign = offsetInMinutes >= 0 ? "+" : "-";
      const formattedOffset = `${sign}${hours}:${minutes}`;
      return { timezone: tz, offset: formattedOffset };
    });

    setTimeZones(allTimeZones);
  };

  useEffect(() => {
    getTimezonesWithOffsets();
  }, []);

  const createIsoString = (
    timeString: string, // e.g., "10:56 AM"
    selectedTimeZone: string
  ) => {
    // Parse the time and date together in the selected timezone

    const isoString = dayjs.tz(
      `${dayjs().format("YYYY-MM-DD")} ${timeString}`,
      "YYYY-MM-DD hh:mm A",
      selectedTimeZone
    );
    return isoString;
  };

  useEffect(() => {
    if (resourceData) {
      const { availableFrom, hourlyRate, Interview, interviewTimeSlots } =
        resourceData;
      const days = Interview?.days;
      form.setFieldsValue({
        availability: availableFrom ? dayjs(availableFrom) : null,
        rate: hourlyRate,
        timeSlot:
          Interview?.startTime && Interview?.endTime
            ? [dayjs(Interview?.startTime), dayjs(Interview?.endTime)]
            : null,
        duration: Interview?.duration,
        days: days ? days?.split(", ").map((day: string) => day.trim()) : null,
        timeZone: Interview?.timeZone,
      });

      if (Array.isArray(interviewTimeSlots)) {
        setSelectedTimeSlots(interviewTimeSlots);
      }
      if (
        Interview?.startTime &&
        Interview?.endTime &&
        Interview?.days?.length > 0 &&
        Interview?.duration
      ) {
        const reqData: {
          duration: number;
          days: string;
          startTime?: string | null | Date;
          endTime?: string | null | Date;
        } = {
          duration: Interview?.duration,
          days: days
            ? days?.split(", ").map((day: string) => day.trim())
            : null,
          startTime: returnTimeOnly(Interview?.startTime),
          endTime: returnTimeOnly(Interview?.endTime),
        };

        dispatch(
          RequestAppAction.handleGetTimeSlots({
            id: resourceData?.id,
            data: reqData,
          })
        );
      }
    }
    if (hasEdit) {
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }

    dispatch(toggleClearTimeSlots());
  }, []);

  const onSave = (e: any) => {
    if (selectedTimeSlots?.length > 0 && !isLoadingPost && !isLoading) {
      const { availability, rate, duration, days, timeSlot, timeZone } = e;
      const reqData = {
        duration: duration,
        days: days,
        startTime: timeSlot[0],
        endTime: timeSlot[1],
        hourlyRate: parseInt(rate),
        slots: selectedTimeSlots,
        availableFrom: availability,
        timeZone: timeZone,
      };

      dispatch(
        RequestAppAction.handlePostTimeSlots({
          id: resourceData?.id,
          data: reqData,
          cbSuccess: () => {
            dispatch(
              RequestAppAction.handleGetResourceById({
                id: resourceData?.id,
                cbSuccess: () => {
                  setTimeout(() => {
                    onSuccess();
                  }, 100);
                },
              })
            );
          },
        })
      );
    } else {
      Notification({
        type: "error",
        message: t("notification.timeSlotsRequired"),
      });
    }
  };

  const returnTimeOnly = (time: string) => {
    const newTime = new Date(time);
    const val = newTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return val || null;
  };

  const getTimeSlots = (val: any) => {
    //values id comes from redux
    const duration = form.getFieldValue("duration");
    const timeSlot = form.getFieldValue("timeSlot");
    const days = form.getFieldValue("days");

    const reqData: {
      duration: number;
      days: string;
      startTime?: string | null | Date;
      endTime?: string | null | Date;
    } = {
      duration: val?.duration ?? duration,
      days: val?.days?.length > 0 ? val?.days : days?.length > 0 ? days : null,
      startTime: null,
      endTime: null,
    };

    if (Array.isArray(val?.timeSlot)) {
      reqData["startTime"] = returnTimeOnly(val?.timeSlot[0]);
      reqData["endTime"] = returnTimeOnly(val?.timeSlot[1]);
    } else if (Array.isArray(timeSlot)) {
      reqData["startTime"] = returnTimeOnly(timeSlot[0]);
      reqData["endTime"] = returnTimeOnly(timeSlot[1]);
    }

    const hasNullValue = Object.values(reqData).some(
      (value) => value === null || value === undefined
    );

    if (hasNullValue) {
      return;
    } else {
      dispatch(
        RequestAppAction.handleGetTimeSlots({
          id: resourceData?.id,
          data: reqData,
          cbSuccess: (res) => {
            if (Array.isArray(res?.data)) {
              setSelectedTimeSlots(res?.data);
            }
          },
        })
      );
    }
  };

  const onSelectIntervals = ({
    startTime,
    endTime,
  }: {
    startTime: any;
    endTime: any;
  }) => {
    if (Array.isArray(selectedTimeSlots) && selectedTimeSlots?.length > 0) {
      const index = selectedTimeSlots.findIndex(
        (item) => item.startTime === startTime && item.endTime === endTime
      );

      if (index !== -1) {
        // If found, remove it
        setSelectedTimeSlots((prev) => {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        });
      } else {
        // If not found, add it
        setSelectedTimeSlots((prev) => [...prev, { startTime, endTime }]);
      }
    } else {
      setSelectedTimeSlots([{ startTime: startTime, endTime: endTime }]);
    }
  };

  const disablePastDates = (currentDate: any) => {
    return currentDate
      ? dayjs(currentDate).isBefore(
          dayjs(new Date()).subtract(-1, "day"),
          "day"
        )
      : false;
  };

  return (
    <Form
      requiredMark={false}
      form={form}
      onFinish={onSave}
      className={styles.cost_box}
    >
      <Spin spinning={isLoading || isLoadingPost || isLoadingGetResource}>
        <WhiteCard
          heading={t("heading.cost")}
          disabled={!resourceData?.id}
          description={t("tab.cost&AvailablityDesc")}
          onSave={() => form.submit()}
        >
          <Content className={`d-flex flex-column gap-4 w-100`}>
            <Content className="bg-white rounded-1 pe-3 d-inline-flex justify-content-center align-items-center">
              <Row gutter={[20, 20]}>
                <Col className="d-flex flex-column gap-2" span={20}>
                  <ChaiiText className={styles.heading}>
                    {/* {t("heading.cost")} */}
                  </ChaiiText>
                  {/* <ChaiiText className={styles.desc}> */}
                  {/* {t("tab.costDesc")} */}
                  {/* </ChaiiText> */}
                </Col>
                <Col span={24}>
                  <Row gutter={[20, 20]}>
                    <Col span={8}>
                      <ChaiInput
                        label={t("input.hourlyRate", {
                          currency: t("common.currency"),
                        })}
                        onlyNumbers
                        placeholder={t("placeholder.hourlyRate", {
                          sign: t("common.currencySign"),
                        })}
                        name="rate"
                        inputType="number"
                        rules={[
                          {
                            required: true,
                            message: t("error.rateRequired"),
                          },
                          {
                            validator: (_: unknown, value: string) => {
                              if (value && Number(value) === 0) {
                                return Promise.reject(
                                  new Error(t("error.rateCannotBeZero"))
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      />
                    </Col>
                    <Col span={8}>
                      <NuDatePicker
                        name="availability"
                        disabledDate={disablePastDates}
                        label={t("input.availableDate")}
                        rules={[
                          {
                            required: true,
                            message: t("error.timeSlotRequired"),
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Col>

                {/* <Col className="d-flex gap-2 flex-column" span={24}>
                   <ChaiiText className={styles.heading}>
                    {t("heading.interviewTimeslots")}
                  </ChaiiText> */}
                {/* <ChaiiText className={styles.desc}>
                    {t("tab.timeSlotsDesc")}
                  </ChaiiText> 
                </Col>*/}

                <Col span={8}>
                  <Dropdown
                    name="timeZone"
                    label={t("input.timeZone")}
                    rules={[
                      {
                        required: true,
                        message: t("error.timezoneRequired"),
                      },
                    ]}
                    options={timeZones?.map((i) => ({
                      value: i?.timezone,
                      label: `${i?.timezone + " " + i?.offset}`,
                    }))}
                  />
                </Col>
                <Col span={8}>
                  <Dropdown
                    name="days"
                    label={t("input.days")}
                    mode="multiple"
                    rules={[
                      {
                        required: true,
                        message: t("error.dayRequired"),
                      },
                    ]}
                    onChange={(val) => {
                      getTimeSlots({ days: val });
                    }}
                    options={[
                      { label: t("days.mon"), value: t("days.mon") },
                      { label: t("days.tue"), value: t("days.tue") },
                      { label: t("days.wed"), value: t("days.wed") },
                      { label: t("days.thu"), value: t("days.thu") },
                      { label: t("days.fri"), value: t("days.fri") },
                      { label: t("days.sat"), value: t("days.sat") },
                      { label: t("days.sun"), value: t("days.sun") },
                    ]}
                  />
                </Col>

                <Col span={8}>
                  <Dropdown
                    name="duration"
                    label={t("input.duration")}
                    optionRender={(e) => `${e?.label} min`}
                    labelRender={(e) => `${e?.label} min`}
                    rules={[
                      {
                        required: true,
                        message: t("error.durationRequired"),
                      },
                    ]}
                    onChange={(val) => {
                      getTimeSlots({ duration: val });
                    }}
                    options={interviewLimits?.map((val) => ({
                      value: val,
                      label: val,
                    }))}
                  />
                </Col>
                <Col span={8}>
                  <TimeRangePicker
                    name="timeSlot"
                    placeholder={[t("placeholder.timeSlot"), ""]}
                    label={t("heading.timeInterval")}
                    rules={[
                      {
                        required: true,
                        message: t("error.timeIntervalRequired"),
                      },
                    ]}
                    onChange={(val) => {
                      getTimeSlots({ timeSlot: val });
                    }}
                  />
                </Col>

                <Col
                  span={24}
                  className="d-flex align-items-start flex-column gap-2"
                >
                  {Array?.isArray(timeSlotsList) &&
                  timeSlotsList?.length > 0 ? (
                    <>
                      {/* <ChaiiText className={styles.descHeading}>
                        {t("input.timeSlot")}
                      </ChaiiText> */}
                      <ChaiiText className={styles.desc_h2}>
                        {t("heading.timeIntervalDesc")}
                      </ChaiiText>
                    </>
                  ) : (
                    <></>
                  )}

                  <Row gutter={[10, 10]} className="gap-2">
                    {Array?.isArray(timeSlotsList)
                      ? timeSlotsList?.map((val, index) => {
                          return (
                            <Col
                              onClick={() => {
                                onSelectIntervals({
                                  startTime: val?.startTime,
                                  endTime: val?.endTime,
                                });
                              }}
                            >
                              <ChaiiText
                                key={index}
                                className={`${styles.input}`}
                              >
                                <Tag
                                  className="cursor-pointer p-1"
                                  color={
                                    selectedTimeSlots?.some(
                                      (i) =>
                                        i.startTime === val?.startTime &&
                                        i.endTime === val?.endTime
                                    )
                                      ? "green"
                                      : "default"
                                  }
                                >{`${val?.startTime} - ${val?.endTime}`}</Tag>
                              </ChaiiText>
                            </Col>
                          );
                        })
                      : Array?.isArray(selectedTimeSlots) &&
                        selectedTimeSlots?.map((val, index) => {
                          return (
                            <Col>
                              <ChaiiText
                                key={index}
                                className={`${styles.input}`}
                              >
                                <Tag
                                  className="cursor-pointer p-1"
                                  color={
                                    selectedTimeSlots?.some(
                                      (i) =>
                                        i.startTime === val?.startTime &&
                                        i.endTime === val?.endTime
                                    )
                                      ? "green"
                                      : "default"
                                  }
                                >
                                  {" "}
                                  {`${val?.startTime} - ${val?.endTime}`}
                                </Tag>
                              </ChaiiText>
                            </Col>
                          );
                        })}
                  </Row>
                </Col>
              </Row>
            </Content>
          </Content>
        </WhiteCard>
      </Spin>
    </Form>
  );
};
export default CostAndAvailibilty;
