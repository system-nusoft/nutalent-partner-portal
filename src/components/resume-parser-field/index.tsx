import { Col, Divider, Flex, Progress, Row, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { Button, ChaiiText } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Inbox } from "src/assets/svg";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import { getSocketResumeValues } from "src/store/selectors/features/socket-resume";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleCreateResourceData } from "src/store/slices/features/create-resource-value-reducer";
import { toggleClearSocketData } from "src/store/slices/features/socket-resume-valuse";
import { Notification } from "../notification";
import styles from "./styles.module.scss";

interface props {
  onClick: () => void;
}

const ResumeParserField = ({ onClick }: props) => {
  const { t } = useTranslation();
  // const resumeData = useSelector(getUploadResumeData);
  const fileInputRef = useRef<any>(null);
  const [percentage, setPercentage] = useState(0);
  const timerRef = useRef<any>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/partners\/([^/]+)/);
  const companyId = match ? match[1] : null;
  const socketValues: any = useSelector(getSocketResumeValues);
  const user: any = useSelector(getCurrentUserData);
  const [isLoading, setIsLoading] = useState(false);

  const incrementPercentage = () => {
    const target = 88;
    const interval = 50;
    const increment = 1;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setPercentage((prev) => {
        if (prev < target) {
          return Math.min(prev + increment, target);
        }
        clearInterval(timerRef.current);
        return prev;
      });
    }, interval);
  };

  const stopAndReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPercentage(0);
  };

  function handleDragOver(e: any) {
    if (!isLoading) {
      if ("preventDefault" in e) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }

  function handleFileSelect(e: any) {
    if (!isLoading) {
      setPercentage(0);
      handleDragOver(e);
      const files = e.target.files || e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        incrementPercentage();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("partnerId", companyId ? companyId : user?.partnerId);
        setIsLoading(true);
        dispatch(
          RequestAppAction.handleUploadResume({
            data: formData,
            cbSuccess: () => {
              fileInputRef.current.value = null;
            },
            cbFailure: () => {
              setIsLoading(false);
              stopAndReset();
              fileInputRef.current.value = null;
            },
          })
        );
      }
    }
  }

  const onSocketResponse = ({
    message,
    type = "error",
  }: {
    message: string;
    type?: "error" | "success";
  }) => {
    Notification({ type, message });
    setIsLoading(false);
    stopAndReset();
    dispatch(toggleClearSocketData());
  };

  useEffect(() => {
    if (socketValues) {
      const { message, resourceId, statusCode } = socketValues;
      switch (statusCode) {
        case 400:
          onSocketResponse({ message });
          break;
        case 200:
          onSocketResponse({ message, type: "success" });
          dispatch(toggleCreateResourceData(resourceId));
          onClick();
          break;
        default:
          break;
      }
    }
  }, [socketValues]);

  return (
    <Flex
      className={`${styles.resource_profile_details_div} bg-white rounded-1  flex-center gap-3 d-flex  flex-column align-items-start`}
    >
      <Row className="w-100">
        {percentage > 0 && (
          <>
            <Col span={24}>
              <Progress percent={percentage} showInfo={false} />
            </Col>
          </>
        )}
      </Row>

      <Content
        onDragOver={handleDragOver}
        onDragLeave={handleDragOver}
        onDrop={handleFileSelect}
        onClick={() => {
          if (!isLoading) fileInputRef.current.click();
        }}
        className={`${styles.container_styles} cursor-pointer rounded-1 p-5 border border-border flex-column gap-3  w-100 d-flex align-items-center justify-content-center`}
      >
        <>
          <Spin spinning={isLoading}>
            <Inbox />
          </Spin>
          <Content className="d-flex align-items-center flex-column  justify-content-center">
            <ChaiiText className={styles.text_heading}>
              {t("heading.clickOrDrag")}
            </ChaiiText>
            <ChaiiText className={styles.text_desc}>
              {t("heading.clickOrDragDesc")}
            </ChaiiText>
          </Content>
        </>

        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          multiple={false}
          onChange={handleFileSelect}
          accept=".pdf,.docx"
        />
        <div
          className={`d-flex align-items-center justify-content-end w-100 ${styles.watermark}`}
        >
          <ChaiiText className={styles.text_heading}>
            {t("placeholder.poweredByAI")}
          </ChaiiText>
        </div>
      </Content>

      <Row className="w-100 d-flex align-items-center justify-content-center">
        <Col span={11}>
          <Divider />
        </Col>
        <Col
          span={2}
          className="d-flex align-items-center justify-content-center"
        >
          <ChaiiText>{t("heading.or")}</ChaiiText>
        </Col>
        <Col span={11}>
          <Divider />
        </Col>
      </Row>
      <Content className="w-100 d-flex align-items-center justify-content-center">
        <Button
          disabled={isLoading}
          onClick={onClick}
          label={t("button.uploadManually")}
        />
      </Content>
    </Flex>
  );
};

export default ResumeParserField;
