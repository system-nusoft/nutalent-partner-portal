import { Col, Flex, Form, Row, Space, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import moment from "moment";
import { Divider } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TrashSquareRed } from "src/assets/svg";
import { getAddResourceFields } from "src/store/selectors/features/add-resource-fields";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import { getExperienceLoading } from "src/store/selectors/features/post-experience";
import RequestAppAction from "src/store/slices/app-actions";
import AddNewRow from "../add-row-button";
import ChaiInput from "../input";
import NuDatePicker from "../range-picker-year";
import WhiteCard from "../white-card";
import styles from "./styles.module.scss";

interface props {
  onSuccess: () => void;
}

const ResourceMainExperiance: React.FC<props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([0]);
  const dispatch = useDispatch();
  const [form] = useForm();
  const tableRef = useRef<HTMLDivElement>(null);
  const isLoading = useSelector(getExperienceLoading);
  const fields: any = useSelector(getAddResourceFields);
  const field = "experience";
  const location = useLocation();
  const pathname = location.pathname;
  const hasEdit = pathname.includes("edit");
  const data: any = useSelector(getResourceByIdData);

  useEffect(() => {
    const experience = data?.WorkExperience;
    if (Array.isArray(experience) && experience?.length > 0) {
      setRows(Array.from({ length: experience?.length }, (_, i) => i));
      setTimeout(() => {
        experience?.map(
          (
            { summary, organization, jobTitle, endDate, startDate }: any,
            i: number
          ) => {
            form.setFieldsValue({
              [`jobTitle_${i}`]: jobTitle,
              [`experianceSummary_${i}`]: summary,
              [`organizationName_${i}`]: organization,
              [`startDate_${i}`]: startDate ? moment(startDate) : null,
              [`endDate_${i}`]: endDate ? moment(endDate) : null,
            });
          }
        );
      }, 100);
    }

    if (hasEdit) {
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }
  }, []);

  const handlePutExperience = (
    e: {
      jobTitle: string;
      experianceSummary: string;
      organizationName: string;
      startDate: any;
      endDate: any;
    }[]
  ) => {
    const reqData = {
      workExperiences: e?.map(
        ({
          jobTitle,
          experianceSummary,
          organizationName,
          startDate,
          endDate,
        }) => ({
          jobTitle,
          summary: experianceSummary,
          organization: organizationName,
          startDate: startDate,
          endDate: endDate ?? null,
          yearsOfExperience: 0, // temp
        })
      ),
    };
    dispatch(
      RequestAppAction.handlePostExperience({
        id: data?.id,
        data: reqData,
        cbSuccess: () => {
          dispatch(
            RequestAppAction.handleGetResourceById({
              id: data?.id,
              cbSuccess: () => {},
            })
          );
          setTimeout(() => {
            onSuccess();
          }, 100);
        },
      })
    );
  };

  const onSave = (e: any) => {
    rows?.map((i: any, _: number) => {
      form.setFieldsValue({
        [`jobTitle_${i}`]: e[`jobTitle_${i}`],
        [`experianceSummary_${i}`]: e[`experianceSummary_${i}`],
        [`organizationName_${i}`]: e[`organizationName_${i}`],
        [`startdate_${i}`]: e[`startDate_${i}`],
        [`endDate_${i}`]: e[`endDate_${i}`],
      });
    });

    const updatedValues = rows?.map((i, _: number) => ({
      jobTitle: e[`jobTitle_${i}`],
      experianceSummary: e[`experianceSummary_${i}`],
      organizationName: e[`organizationName_${i}`],
      startDate: e[`startDate_${i}`],
      endDate: e[`endDate_${i}`],
    }));

    handlePutExperience(updatedValues);
  };

  const handleAddRow = () => {
    setRows([...rows, rows.length]); // Add new row by index
  };

  const handleRemoveRow = (indexToRemove: number) => {
    // Remove the row with the specific ID
    const newRows = rows.filter((id) => id !== indexToRemove);
    setRows(newRows);
  };

  // useEffect(() => {
  //   const resizeObserver = new ResizeObserver((entries) => {
  //     requestAnimationFrame(() => {
  //       entries.forEach((_) => {
  //         // You can handle the resize event here
  //         // For example, adjust the layout or trigger a re-render
  //       });
  //     });
  //   });

  //   if (tableRef.current) {
  //     resizeObserver.observe(tableRef.current); // Observing the table container or a specific element
  //   }

  //   return () => {
  //     resizeObserver.disconnect(); // Cleanup on unmount
  //   };
  // }, [edit]);

  const disablePastDates = (currentDate: any, startDate: any) => {
    return startDate
      ? currentDate &&
          currentDate.isBefore(dayjs(startDate).subtract(-1, "day"), "day")
      : false;
  };

  return (
    <Form form={form} name="experience" className="w-100" onFinish={onSave}>
      <Spin spinning={isLoading}>
        <WhiteCard
          heading={t("profileReview.experiances")}
          description={t("tab.experienceDesc")}
          onSave={() => form.submit()}
          disabled={!data?.id}
        >
          <Flex className="d-flex gap-2  w-100 flex-column">
            <Content>
              {rows?.map((id: any, _) => (
                <>
                  <div
                    key={id}
                    ref={tableRef}
                    className="position-relative p-2 mt-3 rounded-1"
                  >
                    <Row gutter={[10, 10]} className="flex-between">
                      <Col span={6}>
                        <ChaiInput
                          disable={!data?.id}
                          name={`jobTitle_${id}`}
                          inputType="normal"
                          label={t("input.jobTitle")}
                          rules={[
                            {
                              required: true,
                              message: t("error.titleRequired"),
                            },
                          ]}
                        />
                      </Col>
                      <Col span={6}>
                        <ChaiInput
                          disable={!data?.id}
                          name={`organizationName_${id}`}
                          label={t("input.organizationName")}
                          rules={[
                            {
                              required: true,
                              message: t("error.pastExperienceRequired"),
                            },
                          ]}
                        />
                      </Col>
                      <Col span={6}>
                        <NuDatePicker
                          name={`startDate_${id}`}
                          disabled={!data?.id}
                          label={t("input.startDate")}
                          onChange={() => {
                            form.setFieldValue(`endDate_${id}`, null);
                          }}
                          rules={[
                            {
                              required: true,
                              message: t("error.timePeriodRequired"),
                            },
                          ]}
                        />
                      </Col>
                      <Col span={5}>
                        <NuDatePicker
                          name={`endDate_${id}`}
                          disabled={!data?.id}
                          disabledDate={(val) =>
                            disablePastDates(
                              val,
                              form.getFieldValue(`startDate_${id}`)
                            )
                          }
                          label={t("input.endDate")}
                        />
                      </Col>
                    </Row>
                    <ChaiInput
                      height="small"
                      inputType="textArea"
                      label={t("input.summary")}
                      labelToolTip={t("tooltip.starForBulletPoint")}
                      disable={!data?.id}
                      name={`experianceSummary_${id}`}
                      placeholder={t("placeholder.experianceSummary")}
                      rules={[
                        {
                          required: true,
                          message: t("error.experienceSummary"),
                        },
                      ]}
                    />
                    {id !== 0 && (
                      <Space
                        onClick={() => handleRemoveRow(id)}
                        className={styles.minus_styles}
                      >
                        <TrashSquareRed />
                      </Space>
                    )}
                  </div>
                  {id !== rows?.length - 1 ? <Divider /> : <></>}
                </>
              ))}
            </Content>

            <AddNewRow
              title={t("button.addExperience")}
              disable={!data?.id}
              onClick={handleAddRow}
            />
          </Flex>
        </WhiteCard>
      </Spin>
    </Form>
  );
};

export default ResourceMainExperiance;
