import { Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Modal } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ChaiiText from "src/components/chaii-text";
import InputProgress from "src/components/input-progress";
import { Notification } from "src/components/notification";
import ProfileView from "src/components/profile-view";
import ResourceAdded from "src/components/resource-added";
import ResourceProfileDetails from "src/components/resource-profile-details";
import ResumeParserField from "src/components/resume-parser-field";
import {
  costForm,
  educationForm,
  experienceForm,
  hasRequiredValues,
  hasValidArrayForm,
  requiredSummaryForm,
} from "src/constants/constant-values";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleClearCreateResourceData } from "src/store/slices/features/create-resource-value-reducer";
import { toggleClearGetResourceById } from "src/store/slices/features/get-resource-by-id";
import styles from "./add-new-resource-style.module.scss";

const CreateNewResources: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const data: any = useSelector(getResourceByIdData);
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleClearCreateResourceData());
    dispatch(toggleClearGetResourceById());
  }, []);

  const [tabs, setTabs] = useState([
    {
      title: t("heading.addResume"),
      disabled: false,
      filled: 0,
    },
    {
      title: t("resourceDetails.heading"),
      disabled: true,
      filled: 0,
    },
    {
      title: t("heading.viewProfile"),
      disabled: true,
      filled: 0,
    },
  ]);

  const clickManually = () => {
    setTabs(
      tabs.map((i, index) => {
        if (index === 0) {
          return { ...i, filled: 100 };
        } else {
          return i;
        }
      })
    );
    setCurrent(1);
  };

  const handleFields = () => {
    switch (current) {
      case 0:
        return <ResumeParserField onClick={clickManually} />;
      case 1:
        return <ResourceProfileDetails onSuccess={() => onSubmitAll()} />;
      case 2:
        return <ProfileView />;
      default:
        return <></>;
    }
  };

  const onSubmit = () => {
    dispatch(
      RequestAppAction.handlePutResourceById({
        id: data?.id,
        data: { isProfileCompleted: true },
        cbSuccess: () => {
          setTabs(tabs.map((i) => ({ ...i, disabled: true, filled: 100 })));
          setSuccess(true);
        },
      })
    );
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
      setCurrent(2);
    } else {
      Notification({
        type: "error",
        message: t("error.completeTabs"),
      });
    }
  };
  return (
    <Row
      className={`${styles.add_new_resource_style} d-flex align-items-center  flex-column p-2`}
    >
      <Content
        className={`d-flex justify-content-center  ${styles.progress_view}`}
      >
        <InputProgress
          onClickNext={() => {
            onSubmit();
          }}
          onClick={(val) => {
            if (current === 1) {
              modalRef.current?.openModal();
            } else {
              setCurrent(val);
            }
          }}
          success={current === 0 ? true : success}
          current={current}
          labels={tabs}
          onClickBack={() => {
            if (current === 1) {
              modalRef.current?.openModal();
            }
            if (current === 2) {
              setCurrent(current - 1);
            }
          }}
        />
      </Content>
      <Content
        className={`flex-center rounded-1 ${styles.add_new_resource_container} d-flex flex-column align-items-center`}
      >
        {success ? <ResourceAdded /> : handleFields()}
      </Content>
      <Modal
        heading={t("modal.navigateBackModalHeading")}
        isLoading={false}
        onOk={() => (modalRef.current.closeModal(), setCurrent(current - 1))}
        okText={t("button.continue")}
        ref={modalRef}
      >
        <ChaiiText>{t("modal.navigateBackModalDesc")}</ChaiiText>
      </Modal>
    </Row>
  );
};

export default CreateNewResources;
