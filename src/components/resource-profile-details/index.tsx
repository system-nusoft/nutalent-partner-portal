import {
  BookOutlined,
  BulbOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Flex, Spin, Steps, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  educationForm,
  experienceForm,
  hasRequiredValues,
  hasValidArrayForm,
  requiredSummaryForm,
} from "src/constants/constant-values";
import { getAddResourceFields } from "src/store/selectors/features/add-resource-fields";
import { getCreateResourceValues } from "src/store/selectors/features/createResourceValues";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/styles/colors";
import CostAndAvailibilty from "../cost-and-availablity";
import ResourceMainDetail from "../resource-main-details";
import ResourceMainEducation from "../resource-main-education";
import ResourceMainExperiance from "../resource-main-experiance";
import ResourceMainSkills from "../resource-main-skills";
import styles from "./resource-profile-details.module.scss";

const { Text } = Typography;
interface props {
  onSuccess?: () => void;
}
const ResourceProfileDetails = ({ onSuccess }: props) => {
  const [currentTab, setCurrentTab] = useState(0);
  const fieldsCompleted: any = useSelector(getAddResourceFields);
  const { t } = useTranslation();
  const id: any = useSelector(getCreateResourceValues); // id to fetch resource
  const data: any = useSelector(getResourceByIdData);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const hasEdit = pathname.includes("edit");
  const [onClickNext, setOnClickNext] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        RequestAppAction.handleGetResourceById({
          id: id,
          cbSuccess: () => {},
        })
      );
    }
  }, []);

  const onChange = (value: number) => {
    if (!hasEdit) {
      if (hasRequiredValues(data, requiredSummaryForm) && value <= 1) {
        setCurrentTab(value);
      }
      if (
        hasValidArrayForm(data?.WorkExperience, experienceForm) &&
        value <= 2
      ) {
        setCurrentTab(value);
      }
      if (hasRequiredValues(data, ["ResourceSkills"]) && value <= 3) {
        setCurrentTab(value);
      }
      if (
        hasValidArrayForm(data?.EducationHistory, educationForm) &&
        value <= 4
      ) {
        setCurrentTab(value);
      }
    } else {
      setCurrentTab(value);
    }
  };

  const onAddResourceValues = (index: number) => {
    setCurrentTab(index);
  };

  useEffect(() => {
    if (onClickNext) {
      onSuccess && onSuccess();
      setOnClickNext(false);
    }
  }, [onClickNext]);

  const handleFields = (val: number) => {
    const value = val.toString();

    switch (value) {
      case "0":
        return <ResourceMainDetail onSuccess={() => onAddResourceValues(1)} />;
      case "1":
        return <ResourceMainExperiance onSuccess={() => setCurrentTab(2)} />;
      case "2":
        return <ResourceMainSkills onSuccess={() => setCurrentTab(3)} />;
      case "3":
        return <ResourceMainEducation onSuccess={() => setCurrentTab(4)} />;
      case "4":
        return <CostAndAvailibilty onSuccess={() => setOnClickNext(true)} />;
      default:
        return (
          <>
            <Spin />
          </>
        );
    }
  };

  const colorStatus = (curr?: number) => {
    // Run loop to check if the obj foo field required values are not null
    const val = undefined;

    if (currentTab === curr) {
      return colors.primary;
    }

    if (val === "success") {
      return colors.success;
    }
    if (val === "error") {
      return colors.red;
    }

    return colors.grey;
  };

  return (
    <div className={`px-4 w-100 d-flex justify-content-between`}>
      <div className="col-3 bg-white border rounded-3 p-3 ms-2 h-75">
        <Steps
          direction="vertical"
          size="small"
          current={currentTab}
          items={[
            {
              title: "Personal info",

              onClick: () => onChange(0),

              icon: (
                <FileDoneOutlined
                  style={{
                    color: colorStatus(0),
                  }}
                />
              ),
              className: "cursor-pointer",
            },
            {
              title: "Experience",
              onClick: () => onChange(1),
              className: "cursor-pointer",
              icon: (
                <FieldTimeOutlined
                  style={{
                    color: colorStatus(1),
                  }}
                />
              ),
            },
            {
              title: "Skills",
              className: "cursor-pointer",
              onClick: () => onChange(2),
              icon: (
                <BulbOutlined
                  style={{
                    color: colorStatus(2),
                  }}
                />
              ),
            },
            {
              title: "Education",
              onClick: () => onChange(3),
              className: "cursor-pointer",
              icon: (
                <BookOutlined
                  style={{
                    color: colorStatus(3),
                  }}
                />
              ),
            },
            {
              title: "Cost & availablity",
              onClick: () => onChange(4),
              className: "cursor-pointer",
              icon: (
                <ScheduleOutlined
                  style={{
                    color: colorStatus(4),
                  }}
                />
              ),
            },
          ]}
        />
      </div>
      <Flex
        className={`flex-center gap-3 d-flex col-9 flex-column ${styles.resource_profile_details_div}`}
      >
        {handleFields(currentTab)}
      </Flex>
    </div>
  );
};

export default ResourceProfileDetails;
