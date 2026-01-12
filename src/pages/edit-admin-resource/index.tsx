import { Flex, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputProgress from "src/components/input-progress";
import { Notification } from "src/components/notification";
import ProfileView from "src/components/profile-view";
import ResourceProfileDetails from "src/components/resource-profile-details";
import {
  costForm,
  educationForm,
  experienceForm,
  hasRequiredValues,
  hasValidArrayForm,
  requiredSummaryForm,
} from "src/constants/constant-values";
import { getCreateResourceValues } from "src/store/selectors/features/createResourceValues";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import styles from "./editAdminResource.module.scss";

const EditAdminResource: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const data: any = useSelector(getResourceByIdData);
  const idData = useSelector(getCreateResourceValues);
  const { t } = useTranslation();
  const [tabs] = useState([
    { title: "Edit Resource Details", disabled: false },
    {
      title: t("heading.viewProfile"),
      disabled: true,
      backBtn: true,
      filled: 0,
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idData) {
      navigate(-1);
    }
  }, []);

  const dispatch = useDispatch();

  const onSubmit = () => {
    if (
      hasRequiredValues(data, [
        ...requiredSummaryForm,
        "ResourceSkills",
        ...costForm,
      ]) &&
      hasValidArrayForm([...data?.WorkExperience], [...experienceForm]) &&
      hasValidArrayForm([...data?.EducationHistory], [...educationForm])
    ) {
      if (current === 0) {
        setCurrent(1);
      } else {
        dispatch(
          RequestAppAction.handlePutResourceById({
            id: data?.id,
            data: { isProfileCompleted: true },
            cbSuccess: () => {
              Notification({
                type: "success",
                message: t("notification.success"),
              });
              navigate(-1);
            },
          })
        );
      }
    } else {
      Notification({
        type: "error",
        message: t("error.completeTabs"),
      });
    }
  };

  const onSubmitAll = () => {
    if (
      hasRequiredValues(data, [
        ...requiredSummaryForm,
        "ResourceSkills",
        ...costForm,
      ]) &&
      hasValidArrayForm([...data?.WorkExperience], [...experienceForm]) &&
      hasValidArrayForm([...data?.EducationHistory], [...educationForm])
    ) {
      setCurrent(1);
    } else {
      Notification({
        type: "error",
        message: t("error.completeTabs"),
      });
    }
  };

  return (
    <Row
      className={`${styles.add_new_resource_style}  d-flex w-100   flex-column p-2 pt-4 `}
    >
      <Flex className={`d-flex justify-content-center ${styles.progress_view}`}>
        <InputProgress
          onClickNext={() => {
            onSubmit();
          }}
          onClick={(val) => {
            setCurrent(val);
          }}
          labels={tabs}
          current={current}
        />
      </Flex>
      <Content
        className={`flex-center rounded-1 ${styles.add_new_resource_container} d-flex flex-column align-items-center`}
      >
        {current === 0 ? (
          <ResourceProfileDetails onSuccess={() => onSubmitAll()} />
        ) : (
          <ProfileView />
        )}
      </Content>
    </Row>
  );
};

export default EditAdminResource;
