import { Modal } from "nusoft_components";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Warning } from "src/assets/svg";

interface props {
  onClose: () => void;
  onOk: () => void;
  ref?: any;
}

const RemovePictureConfirmModal = forwardRef(
  ({ onClose, onOk }: props, ref) => {
    const { t } = useTranslation();

    return (
      <Modal
        okText="Remove"
        heading={t("modal.restrictHeadingPicture")}
        ref={ref}
        headingIcon={<Warning />}
        onClose={onClose}
        onOk={onOk}
      >
        {t("modal.restrictParagraphPicture")}
      </Modal>
    );
  }
);

export default RemovePictureConfirmModal;
