import { Flex, Form, Space, Spin, Table, TableProps } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TrashSquareRed } from "src/assets/svg";
import { DataTypeEducationTable } from "src/constants/education-types";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import { getPostEducationLoading } from "src/store/selectors/features/post-education";
import RequestAppAction from "src/store/slices/app-actions";
import AddNewRow from "../add-row-button";
import ChaiInput from "../input";
import NuDatePicker from "../range-picker-year";
import WhiteCard from "../white-card";
import styles from "./styles.module.scss";

interface props {
  onSuccess: () => void;
}

const ResourceMainEducation: React.FC<props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const resourceData: any = useSelector(getResourceByIdData);
  const dispatch = useDispatch();
  const isLoading = useSelector(getPostEducationLoading);
  const [data, setData] = useState([
    {
      id: `${Math.random() * 1000}`,
    },
  ]);
  const location = useLocation();
  const pathname = location.pathname;
  const hasEdit = pathname.includes("edit");

  useEffect(() => {
    const education = resourceData?.EducationHistory;
    if (Array.isArray(education) && education?.length > 0) {
      setData(education);
      education?.map(
        ({ institute, certification, completionDate }: any, i: number) => {
          form.setFieldsValue({
            [`completion_${i}`]: dayjs(completionDate),
            [`education_${i}`]: certification,
            [`institute_${i}`]: institute,
          });
        }
      );
    }

    if (hasEdit) {
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }
  }, [0]);

  const handleSubmitEducation = (val: any) => {
    const reqData = {
      educationHistory: val?.map(
        ({ completion, education, institute }: any) => ({
          completionDate: completion,
          institute,
          certification: education,
        })
      ),
    };

    dispatch(
      RequestAppAction.handlePostEducation({
        id: resourceData?.id,
        data: reqData,
        cbSuccess: () => {
          setData(val);
          dispatch(
            RequestAppAction.handleGetResourceById({
              id: resourceData?.id,
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
    data?.map((_: any, i: number) => {
      form.setFieldsValue({
        completion: e[`completion_${i}`],
        education: e[`education_${i}`],
        institute: e[`institute_${i}`],
      });
    });

    const updatedValues = data?.map(({ key }: any, i: number) => ({
      key: key,
      completion: e[`completion_${i}`],
      education: e[`education_${i}`],
      institute: e[`institute_${i}`],
    }));

    handleSubmitEducation(updatedValues);
  };

  const columns: TableProps<DataTypeEducationTable>["columns"] = [
    {
      title: "Education/Certification",
      dataIndex: "education",
      key: "education",
      width: 100,
    },
    {
      title: "Institute",
      dataIndex: "institute",
      key: "institute",
      width: 200,
    },
    {
      title: "Completion",
      dataIndex: "completion",
      key: "completion",
      width: 100,
    },
  ];

  const updatedColumns = columns.map((column: any) => {
    if (column.dataIndex === "education") {
      return {
        ...column,
        render: (text: string, _: any, index: number) => (
          <ChaiInput
            name={`education_${index}`}
            rules={[{ required: true, message: t("error.educationRequired") }]}
            initialValue={text}
            disable={!resourceData?.id}
            inputType="normal"
            placeholder={t("placeholder.education")}
          />
        ),
      };
    }

    if (column.dataIndex === "institute") {
      return {
        ...column,
        render: (text: string, _: any, index: number) => (
          <ChaiInput
            name={`institute_${index}`}
            initialValue={text}
            disable={!resourceData?.id}
            rules={[{ required: true, message: t("error.instituteRequired") }]}
            inputType="normal"
            placeholder={t("placeholder.institute")}
          />
        ),
      };
    }
    if (column.dataIndex === "completion") {
      return {
        ...column,
        render: (_: string, record: any, index: number) => (
          <Flex className="position-relative">
            <NuDatePicker
              type="year"
              disabled={!resourceData?.id}
              name={`completion_${index}`}
              rules={[
                { required: true, message: t("error.completionYearRequired") },
              ]}
              placeholder={t("placeholder.completion")}
            />
            {index !== 0 && (
              <Space
                onClick={() => {
                  form.setFieldsValue({
                    [`completion_${index}`]: null,
                    [`education_${index}`]: null,
                    [`institute_${index}`]: null,
                  });
                  const filteredData = data.filter(
                    (res) => res?.id !== record?.id
                  );

                  setData(filteredData);
                }}
                className={`cursor-pointer ${styles.minus_styles}`}
              >
                <TrashSquareRed />
              </Space>
            )}
          </Flex>
        ),
      };
    }

    return column;
  });

  const tableRef = useRef<HTMLDivElement>(null); // Reference to the table wrapper

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        entries.forEach((_) => {
          // You can handle the resize event here
          // For example, adjust the layout or trigger a re-render
        });
      });
    });

    if (tableRef.current) {
      resizeObserver.observe(tableRef.current); // Observing the table container or a specific element
    }

    return () => {
      resizeObserver.disconnect(); // Cleanup on unmount
    };
  }, []); //

  return (
    <Form form={form} onFinish={onSave} className="w-100">
      <Spin spinning={isLoading}>
        <WhiteCard
          heading={t("profileReview.education")}
          description={t("tab.educationDesc")}
          disabled={!resourceData?.id}
          onSave={() => form.submit()}
        >
          <Flex className="w-100 d-flex flex-column mt-3">
            <>
              <div ref={tableRef}>
                <Table
                  columns={[...updatedColumns]}
                  style={{ width: "100%" }}
                  pagination={false}
                  dataSource={data}
                />
              </div>
              <AddNewRow
                title={t("button.addEducation")}
                disable={!resourceData?.id}
                onClick={() => {
                  setData([
                    ...data,
                    {
                      id: `${Math.random() * 1000}`,
                    },
                  ]);
                }}
              />
            </>
          </Flex>
        </WhiteCard>
      </Spin>
    </Form>
  );
};

export default ResourceMainEducation;
