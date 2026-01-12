import { Avatar, Col, Form, Row, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { Button } from "nusoft_components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { EditPen } from "src/assets/svg";
import { ModalInterfaceProps } from "src/services/user-type";
import {
  getPartnerData,
  getPartnerLoading,
} from "src/store/selectors/features/get-partner";
import { getUploadImageLoading } from "src/store/selectors/features/image-selector";
import { PutPartnerAccountSettingsLoading } from "src/store/selectors/features/put-partner-account-settings";
import RequestAppAction from "src/store/slices/app-actions";
import ChaiInput from "../input";
import NuDatePicker from "../range-picker-year";
import RemovePictureConfirmModal from "../remove-confirm-modal";
import styles from "./partner-email-details.module.scss";

const PartnerEmailDetails = ({}) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef: any = useRef<HTMLInputElement | null>(null);
  const ref = useRef<ModalInterfaceProps>(null);
  const partnerDetails: any = useSelector(getPartnerData);
  const isLoading = useSelector(getPartnerLoading);
  const isUploadingImage = useSelector(getUploadImageLoading);
  const isUploading = useSelector(PutPartnerAccountSettingsLoading);
  const location = useLocation();
  const pathname = location.pathname;
  const match = pathname.match(/partners\/([^/]+)/);
  const id = match ? match[1] : null;

  useEffect(() => {
    if (id) dispatch(RequestAppAction.handleGetPartner({ id }));
  }, []);

  function handleFileSelect(e: any) {
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

  useEffect(() => {
    if (partnerDetails) {
      form.setFieldsValue({
        companyName: partnerDetails?.companyName,
        onboardingDate: partnerDetails?.onboardingDate,
      });
      setImage(partnerDetails?.companyLogo);
    }
  }, [partnerDetails]);
  const clearImage = () => {
    ref?.current?.closeModal();
    setImage(null);
  };

  const navigate = useNavigate();
  const onSave = (e: any) => {
    const { companyName } = e;
    if (companyName) {
      const reqData: {
        companyName: string;
        companyLogo?: string | null;
      } = {
        companyName,
      };

      if (image) {
        reqData.companyLogo = image;
      }

      if (id) {
        dispatch(
          RequestAppAction.handlePutPartnerAccountSettings({
            data: reqData,
            id: id,
            cbSuccess: () => {
              navigate(-1);
            },
          })
        );
      }
    }
  };

  return (
    <Spin spinning={isLoading || isUploadingImage || isUploading}>
      <Form
        requiredMark={false}
        form={form}
        name="cost"
        onFinish={onSave}
        className={
          "w-100 justify-content-center align-items-center d-flex flex-column gap-3"
        }
      >
        <div className="w-100 justify-content-end align-items-end d-flex">
          <Button label={t("button.saveChanges")} btnType="submit" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple={false}
          className="d-none"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png"
        />

        <div
          className="position-relative bg-white"
          style={{ padding: "0.2rem", borderRadius: "100rem" }}
        >
          {image ? (
            <Avatar size={90} src={image} className={styles.avatar} />
          ) : (
            <Avatar size={90} className={styles.avatar}>
              {partnerDetails?.companyName?.charAt(0)?.toLocaleUpperCase()}
            </Avatar>
          )}
          <div
            onClick={() => {
              fileInputRef.current.click();
            }}
            className={`position-absolute cursor-pointer bottom-0 d-flex align-items-center justify-content-center p-1 end-0 bg-white ${styles.edit_icon}`}
          >
            <EditPen />
          </div>
        </div>

        <Row gutter={[20, 20]} className="w-75 d-flex">
          <Col span={12}>
            <ChaiInput label={t("input.companyName")} name="companyName" />
          </Col>
          <Col span={12}>
            <NuDatePicker
              label={t("input.onboardingDate")}
              name="onboardingDate"
              disabled
            />
          </Col>
          <Col span={24}>
            <ChaiInput label={t("input.recoveryEmail")} disable name="email" />
          </Col>
        </Row>
        <RemovePictureConfirmModal
          ref={ref}
          onClose={() => {}}
          onOk={() => {
            clearImage();
          }}
        />
      </Form>
    </Spin>
  );
};
export default PartnerEmailDetails;
