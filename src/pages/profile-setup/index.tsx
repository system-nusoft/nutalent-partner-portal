import { CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Col, Flex, Form, Row, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { AuthScreenTemplate, Button } from "nusoft_components";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ImagePlaceholder, Logo } from "src/assets/svg";
import ChaiInput from "src/components/input";
import { Notification } from "src/components/notification";
import RemovePictureConfirmModal from "src/components/remove-confirm-modal";
import { PASSWORDREGEX } from "src/constants/constant-values";
import { ROUTES } from "src/constants/navigation-routes";
import { LocalStorageService } from "src/services/local-storage";
import { ModalInterfaceProps } from "src/services/user-type";
import { accountSetupLoading } from "src/store/selectors/features/account-setup";
import { getUploadImageLoading } from "src/store/selectors/features/image-selector";
import RequestAppAction from "src/store/slices/app-actions";
import bg from "../../assets/images/background.png";
import styles from "./profile-setup-styles.module.scss";
const { Text } = Typography;

const localStorageService = new LocalStorageService();

export const ProfileSetup: React.FC = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef: any = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isUploadingImage = useSelector(getUploadImageLoading);
  const userId = params.get("userId");
  const token = params.get("token");
  const [form] = useForm();
  const isLoading = useSelector(accountSetupLoading);
  const ref = useRef<ModalInterfaceProps>(null);
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
  const navigate = useNavigate();

  const getUrlParams = () => {
    if (token && userId)
      dispatch(
        RequestAppAction.handleVerifyPartnerToken({
          token: token,
          userId,
          cbSuccess: () => {
            //TODO: might use this in future
            // localStorageService
            //   .persist("user", JSON.stringify({ jwtToken: token }))
            //   .then(() => {
            //     dispatch(
            //       RequestAppAction.handleGetPartner({
            //         id: userId,
            //         cbSuccess: (res) => {
            //           form.setFieldsValue({
            //             companyName: res?.companyName,
            //             recoveryEmail: res?.recoveryEmail,
            //             email: res?.users[0]?.email,
            //           });
            //         },
            //       })
            //     );
            //   });
          },
          cbFailure: () => {
            navigate(ROUTES.LOGIN);
          },
        })
      );
    else navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    getUrlParams();
  }, []);

  const onFinish = (values: any) => {
    const { firstName, lastName, password } = values;
    const reqObj: {
      firstName: string;
      lastName: string;
      password: string;
      companyLogo?: string | null;
      userId: any;
    } = {
      firstName,
      lastName,
      password,
      userId: userId,
    };
    if (image) reqObj.companyLogo = image;
    if (!isLoading && !isUploadingImage) {
      dispatch(
        RequestAppAction.handleAccountSetup({
          data: { ...reqObj },
          cbSuccess: () => {
            Notification({
              type: "success",
              message: t("notification.success"),
            });
            navigate(ROUTES.LOGIN);
          },
        })
      );
    }
  };

  const comparePasswords = () => {
    const debounceTimeout = setTimeout(() => {
      const val = form.getFieldValue("password");
      if (!PASSWORDREGEX.test(val) && val?.length > 0) {
        form.setFields([
          {
            name: "password",
            errors: [t("error.passwordRegexError")],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "password",
            errors: undefined,
          },
        ]);
      }
    }, 500);
    return () => {
      clearTimeout(debounceTimeout);
    };
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        onChange={handleFileSelect}
        accept=".jpg,.jpeg,.png"
      />
      <RemovePictureConfirmModal
        ref={ref}
        onClose={() => {}}
        onOk={() => {
          clearImage();
        }}
      />
      <AuthScreenTemplate
        backgroundImagePath={bg}
        logoPath={<Logo />}
        sloganText={t("auth.slogan")}
        copyrightText={t("heading.copyright")}
      >
        <Content
          className={`${styles.account_settings_container} d-flex flex-column justify-content-center align-items-center`}
        >
          <Flex
            vertical
            className={`${styles.heading_profile_setup_div} w-100 mb-2 d-flex flex-column align-items-center`}
          >
            <Text className={styles.heading_profile_setup}>
              {t("profile-setup.heading")}
            </Text>
            <Text className={styles.des_profile_setup}>
              {t("profile-setup.description")}
            </Text>
          </Flex>
          <Form
            requiredMark={false}
            onFinish={onFinish}
            name="accountSetup"
            form={form}
          >
            <Row
              gutter={[25, 10]}
              className="w-100 d-flex mt-2 justify-content-center align-items-center"
            >
              <Col
                span={24}
                className={`mt-2 h-100 align-end d-flex flex-column align-items-center`}
              >
                <Flex className={`${styles.settings_col_div} `}>
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
                </Flex>
              </Col>
              <Col
                className="d-flex flex-column  align-items-center justify-content-center"
                span={24}
              >
                <div
                  className={`d-flex gap-3  flex-column ${styles.input_styles}`}
                >
                  <ChaiInput
                    disable={isLoading || isUploadingImage}
                    name={"firstName"}
                    placeholder={t("placeholder.name")}
                    label={t("input.firstName")}
                    rules={[
                      { required: true, message: t("error.nameRequired") },
                    ]}
                  />
                  <ChaiInput
                    disable={isLoading || isUploadingImage}
                    name={"lastName"}
                    placeholder={t("placeholder.name")}
                    label={t("input.lastName")}
                    rules={[
                      { required: true, message: t("error.nameRequired") },
                    ]}
                  />
                  <ChaiInput
                    disable={isLoading || isUploadingImage}
                    name={"password"}
                    placeholder={t("placeholder.password")}
                    label={t("input.password")}
                    type="password"
                    onChange={comparePasswords}
                    rules={[
                      {
                        required: true,
                        message: t("error.passwordRequired"),
                      },
                    ]}
                  />
                </div>
              </Col>
              <Col className="d-flex gap-3 flex-column" span={10}></Col>

              <span className="mt-3 d-flex justify-content-center w-100">
                <Spin spinning={isLoading}>
                  <Button
                    label={t("button.submit")}
                    btnClass="filledBtnLarge"
                    btnType="submit"
                  />
                </Spin>
              </span>
            </Row>
          </Form>
        </Content>
      </AuthScreenTemplate>
    </>
  );
};
