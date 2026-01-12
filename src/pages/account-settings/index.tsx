import { CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Col, Form, Row, Space, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlaceholder } from "src/assets/svg";
import AccountResetPasswordFields from "src/components/account-reset-password";
import AccountSetupInputs from "src/components/account-setup-inputs";
import { Notification } from "src/components/notification";
import RemovePictureConfirmModal from "src/components/remove-confirm-modal";
import { isPartner, ModalInterfaceProps } from "src/services/user-type";
import { getPartnerData } from "src/store/selectors/features/get-partner";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import { getUploadImageLoading } from "src/store/selectors/features/image-selector";
import RequestAppAction from "src/store/slices/app-actions";
import styles from "./account-settings-styles.module.scss";

const { Text } = Typography;

export const AccountSettings: React.FC = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef: any = useRef<HTMLInputElement | null>(null);
  const user: any = useSelector(getCurrentUserData);
  const partner: any = useSelector(getPartnerData);
  const ref = useRef<ModalInterfaceProps>(null);
  const dispatch = useDispatch();
  const isUploadingImage = useSelector(getUploadImageLoading);

  const [form] = useForm();

  const onButtonClick = () => {
    fileInputRef.current?.click();
    fileInputRef.current.value = null;
  };

  async function handleFileSelect(e: any) {
    const files = e.target.files || e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);

      dispatch(
        RequestAppAction.handleUploadImage({
          data: formData,
          cbSuccess: (res) => {
            setImage(res?.data); // not sure for url param (s3 credentials not upload for now)
          },
        })
      );
    }
  }

  const clearImage = () => {
    setImage(null);
    ref?.current?.closeModal();
  };

  const handleFormValues = () => {
    form.setFieldsValue({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    });
  };

  const getPartnerDetails = () => {
    setImage(partner?.companyLogo);
    form.setFieldsValue({
      websiteURL: partner?.websiteURL,
      recoveryEmail: partner?.recoveryEmail,
    });
  };

  useEffect(() => {
    handleFormValues();
    if (isPartner() && user) {
      getPartnerDetails();
    }
  }, [user, partner]);

  const onFinish = (val: {
    commpanyName?: string;
    recoveryEmail?: string;
    companyLogo?: string;
    websiteURL?: string;
  }) => {
    if (isPartner()) {
      const reqObj = { ...val, companyLogo: image || null };

      dispatch(
        RequestAppAction.handlePutPartnerAccountSettings({
          data: reqObj,
          id: partner?.id,
          cbSuccess: () => {
            if (isPartner())
              dispatch(
                RequestAppAction.handleGetPartner({
                  id: user?.partnerId,
                })
              );
            Notification({
              type: "success",
              message: t("notification.success"),
            });
          },
        })
      );
    }
  };

  return (
    <Content
      className={`${styles.account_settings_container} d-flex h-100 justify-content-center align-items-center`}
    >
      <RemovePictureConfirmModal
        ref={ref}
        onClose={() => {}}
        onOk={() => {
          clearImage();
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        onChange={handleFileSelect}
        accept=".jpg,.jpeg,.png"
      />
      <Row
        gutter={25}
        className={`w-100 h-100 d-flex justify-content-center align-items-start `}
      >
        {isPartner() && (
          <Col className="border border-border rounded-2 p-5" span={11}>
            <Row gutter={20}>
              <Col
                className={`${styles.settings_col_div} align-start d-flex flex-column align-items-center`}
                span={12}
              >
                <Form form={form} onFinish={onFinish} name="accountSettings">
                  <AccountSetupInputs />
                </Form>
              </Col>
              <Col
                className={`${styles.settings_col_div}  d-flex flex-column  align-items-center`}
                span={12}
              >
                <Space
                  align="start"
                  className={`d-flex flex-column justify-content-start w-50 align-items-start`}
                >
                  <Text className={`${styles.profile_image_card_heading}`}>
                    {t("heading.profilePicture")}
                  </Text>
                </Space>
                <Space
                  className={`d-flex flex-column justify-content-start w-50 align-items-start`}
                  align="start"
                >
                  <Spin spinning={isUploadingImage}>
                    <Avatar
                      onClick={() => {
                        if (!image) onButtonClick();
                      }}
                      className="cursor-pointer bg-white border"
                      size={120}
                      src={image || undefined}
                    >
                      <ImagePlaceholder />
                    </Avatar>
                    {image && (
                      <div
                        onClick={() => {
                          if (image) ref?.current?.openModal();
                        }}
                        className="position-absolute top-0 end-0 cursor-pointer"
                      >
                        <CloseCircleOutlined />
                      </div>
                    )}
                  </Spin>
                </Space>
              </Col>
            </Row>
          </Col>
        )}
        <Col />
        <Col
          className={`${
            isPartner() ? "p-5" : "p-2"
          } h-100  border border-border  rounded-2`}
          span={11}
        >
          <AccountResetPasswordFields />
        </Col>
      </Row>
    </Content>
  );
};
