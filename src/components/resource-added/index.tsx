import { Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import { Button, ChaiiText } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "src/constants/routes-types";
import styles from "./styles.module.scss";
const ResourceAdded = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToResources = () => {
    navigate(PrivateRoutes.RESOURCES);
  };
  return (
    <Content className="d-flex  p-5 w-75 rounded-1 flex-column gap-4">
      <Content className="rounded-1 flex-column gap-4  d-inline-flex justify-content-center align-items-center">
        <div className={styles.tea_gif} />
        <Flex className="d-flex flex-column">
          <ChaiiText className={styles.resource_added_text_heading}>
            {t("profileReview.resourceSuccessfullyAdded")}
          </ChaiiText>
          <ChaiiText className={styles.resource_added_text_heading_desc}>
            {t("profileReview.resourceSuccessfullyAddedDesc")}
          </ChaiiText>
        </Flex>
        <Flex>
          <Button
            label={t("button.navigateToResources")}
            onClick={navigateToResources}
            btnClass="filledBtnLarge"
          />
        </Flex>
      </Content>
    </Content>
  );
};

export default ResourceAdded;
