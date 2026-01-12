import { Flex } from "antd";
import { ChaiiText } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { Inbox } from "src/assets/svg";
import styles from "./upload-component.module.scss";

const UploadPDFComponent = () => {
  const { t } = useTranslation();
  return (
    <Flex
      className={`flex-center  ${styles.upload_pdf_div} w-100 d-flex flex-column align-items-center`}
    >
      <Flex className="flex-center">
        <Inbox />
      </Flex>
      <Flex className="flex-center flex-column">
        <ChaiiText
          className={`${styles.upload_pdf_heading} align-items-center`}
        >
          {t("uploadPdf.heading")}
        </ChaiiText>
        <ChaiiText className={`align-items-center ${styles.upload_pdf_desc}`}>
          {t("uploadPdf.desc")}
        </ChaiiText>
      </Flex>
    </Flex>
  );
};

export default UploadPDFComponent;
