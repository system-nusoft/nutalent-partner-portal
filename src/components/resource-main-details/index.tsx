import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Col, Form, Row, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ImagePlaceholder } from "src/assets/svg";
import { textAreaMaxLength } from "src/constants/constant-values";
import { ModalInterfaceProps } from "src/services/user-type";
import {
  getResourceByIdData,
  getResourceByIdLoading,
} from "src/store/selectors/features/get-resource-by-id";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import { getUploadImageLoading } from "src/store/selectors/features/image-selector";
import { PostResourceLoading } from "src/store/selectors/features/post-resource";
import { uploadResourceByIdLoading } from "src/store/selectors/features/resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import { colors } from "src/styles/colors";
import ChaiInput from "../input";
import RemovePictureConfirmModal from "../remove-confirm-modal";
import WhiteCard from "../white-card";

interface props {
  onSuccess: (data: any) => void;
}

const ResourceMainDetail: React.FC<props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  // const values: any = useSelector(getCreateResourceValues);
  // const fields: any = useSelector(getAddResourceFields);
  const user: any = useSelector(getCurrentUserData);
  const isLoading = useSelector(PostResourceLoading);
  const isUploadingImage = useSelector(getUploadImageLoading);
  const isFetching = useSelector(getResourceByIdLoading);
  const isFetchingResrouce = useSelector(uploadResourceByIdLoading);
  const data: any = useSelector(getResourceByIdData);
  const [form] = useForm();
  const [image, setImage] = useState<string | undefined>(undefined);
  const fileInputRef: any = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/partners\/([^/]+)/);
  const hasEdit = pathname.includes("edit");
  const companyId = match ? match[1] : null;
  const ref = useRef<ModalInterfaceProps>(null);
  const field = "main";

  useEffect(() => {
    if (hasEdit) {
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }
  }, []);

  const handlePatchResrouce = (value: {
    title: string;
    summary: string;
    lastName: string;
    firstName: string;
  }) => {
    const { firstName, title, summary, lastName } = value;
    const reqData: {
      firstName: string;
      lastName: string;
      title: string;
      profileSummary: string;
      profilePicture?: string | null;
    } = {
      firstName,
      title,
      profileSummary: summary,
      lastName,
      profilePicture: image || null,
    };

    dispatch(
      RequestAppAction.handlePutResourceById({
        id: data?.id,
        data: reqData,
        cbSuccess: (res) => {
          dispatch(
            RequestAppAction.handleGetResourceById({
              id: data?.id,
            })
          );

          const { firstName, lastName, title, summary } = res?.data;
          setTimeout(() => {
            onSuccess({ firstName, lastName, title, summary });
          }, 100);
        },
      })
    );
  };

  const handleCreateResrouce = (value: {
    title: string;
    summary: string;
    lastName: string;
    firstName: string;
  }) => {
    const { title, summary, firstName, lastName } = value;
    const reqData: {
      firstName: string;
      lastName: string;
      title: string;
      profileSummary: string;
      profilePicture?: string | null;
      partnerId: string;
    } = {
      firstName,
      lastName,
      title,
      profileSummary: summary,
      partnerId: companyId ? companyId : user?.partnerId,
    };

    if (image) reqData["profilePicture"] = image;

    dispatch(
      RequestAppAction.handlePostResource({
        data: { ...reqData },
        cbSuccess: (res) => {
          dispatch(
            RequestAppAction.handleGetResourceById({
              id: res?.id,
              cbSuccess: () => {},
            })
          );

          const { firstName, lastName, title, summary } = res;

          setTimeout(() => {
            onSuccess({ firstName, lastName, title, summary });
          }, 100);
        },
      })
    );
  };

  const onSave = (e: any) => {
    if (data?.id) {
      handlePatchResrouce(e);
    } else {
      handleCreateResrouce(e);
    }
  };

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
            setImage(res?.data);
          },
        })
      );
    }
  }

  const clearImage = () => {
    setImage(undefined);
    ref?.current?.closeModal();
  };

  useEffect(() => {
    if (data) {
      setImage(data?.profilePicture);
      form.setFieldsValue({
        firstName: data?.firstName,
        lastName: data?.lastName,
        title: data?.title,
        summary: data?.profileSummary,
      });
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }
  }, [data]);

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
      <WhiteCard
        heading={t("profileReview.profileSummary")}
        onSave={() => form.submit()}
        description={t("tab.profileSummaryDesc")}
      >
        <Form
          requiredMark={false}
          name="main"
          form={form}
          className="w-100"
          onFinish={(e) => onSave(e)}
        >
          <Spin spinning={isLoading || isFetching || isFetchingResrouce}>
            <Content className="w-100  d-flex justify-content-start gap-2  align-items-start flex-column">
              <div className="d-flex  position-relative w-100 justify-content-start align-items-start ">
                <Spin spinning={isUploadingImage}>
                  <Avatar
                    onClick={() => {
                      if (!image) onButtonClick();
                    }}
                    className="cursor-pointer  my-2 bg-white border"
                    size={120}
                    src={image || undefined}
                  >
                    <ImagePlaceholder />
                  </Avatar>
                  {image ? (
                    <div
                      style={{
                        top: "1rem",
                        right: "0.2rem",
                        zIndex: 1,
                        padding: "0.1rem",
                        borderRadius: "100%",
                        background: colors.white,
                        height: "1.5rem",
                        width: "1.5rem",
                      }}
                      onClick={() => {
                        if (image) ref?.current?.openModal();
                      }}
                      className="position-absolute d-flex justify-content-center align-items-center  end-0 cursor-pointer"
                    >
                      <CloseCircleOutlined />
                    </div>
                  ) : (
                    <div
                      style={{
                        bottom: "1rem",
                        right: "0.2rem",
                        zIndex: 1,
                        padding: "0.2rem",
                        borderRadius: "100%",
                        background: colors.white,
                      }}
                      onClick={() => {
                        if (!image) onButtonClick();
                      }}
                      className="position-absolute  cursor-pointer"
                    >
                      <PlusCircleOutlined />
                    </div>
                  )}
                </Spin>
                {/* <div
                  className={`p-2 d-flex justify-content-start align-items-start   cursor-pointer ${styles.image_box} `}
                >
                  <div
                    style={{ position: "relative" }}
                    className="d-flex relative flex-column"
                  >
                    <Image
                      width={100}
                      height={100}
                      preview={false}
                      src={image}
                      style={{
                        borderRadius: 100,
                        overflow: "hidden",
                      }}
                      fallback={antdBase64}
                    />
                    <Flex
                      style={{
                        position: "absolute",
                        bottom: -10,
                        right: 0,
                      }}
                      onClick={() => {
                        if (image) ref?.current?.openModal();
                        else onButtonClick();
                      }}
                    >
                      {image ? (
                        <TrashSquare />
                      ) : (
                        <div>
                          <Plus />
                        </div>
                      )}
                    </Flex>
                  </div>
                </div> */}
              </div>

              <Row gutter={10} className="d-flex justify-content-start w-100">
                <Col span={12}>
                  <ChaiInput
                    rules={[
                      {
                        required: true,
                        message: t("error.nameRequired"),
                      },
                    ]}
                    name="firstName"
                    label={t("input.firstName")}
                    placeholder={t("placeholder.name")}
                  />
                </Col>
                <Col span={12}>
                  <ChaiInput
                    rules={[
                      {
                        required: true,
                        message: t("error.nameRequired"),
                      },
                    ]}
                    name="lastName"
                    label={t("input.lastName")}
                    placeholder={t("placeholder.lastName")}
                  />
                </Col>
                <Col className="d-flex flex-column" span={24}>
                  {/* close btn in library */}
                  <ChaiInput
                    rules={[
                      {
                        required: true,
                        message: t("error.titleRequired"),
                      },
                    ]}
                    placeholder={t("placeholder.title")}
                    label={t("input.designation")}
                    name="title"
                  />
                </Col>
              </Row>
            </Content>
            <Row className="w-100" gutter={[10, 10]}>
              <Col span={24}>
                <ChaiInput
                  inputType="textArea"
                  maxLength={textAreaMaxLength}
                  name="summary"
                  label={t("input.summary")}
                  labelToolTip={t("tooltip.starForBulletPoint")}
                  height="middle"
                  rules={[
                    {
                      required: true,
                      message: t("error.summaryRequired"),
                    },
                  ]}
                  placeholder={t("placeholder.summary")}
                />
              </Col>
            </Row>
          </Spin>
        </Form>
      </WhiteCard>
    </>
  );
};

export default ResourceMainDetail;
