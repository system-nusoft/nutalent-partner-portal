import { Flex } from "antd";
import { ChaiiText } from "nusoft_components";
import { useTranslation } from "react-i18next";
import "./add-new-row-styles.scss";

interface btnProps {
  onClick?: (e: React.MouseEvent) => void;
  disable?: boolean;
  title?: string;
}

const AddNewRow = ({ onClick, disable, title }: btnProps) => {
  const { t } = useTranslation();
  return (
    <Flex
      onClick={(e) => {
        if (!disable && onClick) onClick(e);
      }}
      className="add-new-row-container-grey d-flex justify-content-center align-items-center"
    >
      <ChaiiText className="add-new-row-button-text text-center">
        {title ?? t("button.addRow")}
      </ChaiiText>
    </Flex>
  );
};

export default AddNewRow;
