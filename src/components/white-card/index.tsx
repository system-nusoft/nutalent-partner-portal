import { Col, Flex, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { Button, ChaiiText } from "nusoft_components";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./white-card-styles.module.scss";

interface props {
  children: React.ReactNode;
  heading?: string;
  description?: string;
  onEdit?: () => void;
  edit?: boolean;
  onSave?: any;
  disabled?: boolean;
  btnType?: "button" | "submit" | "reset" | undefined;
}

const WhiteCard = ({
  children,
  heading,
  onSave,
  disabled,
  description,
  btnType = "button",
}: props) => {
  const { t } = useTranslation();
  return (
    <Content
      style={{ boxShadow: "" }}
      className={`p-4 ${
        disabled ? styles.disabled : styles.enabled
      } rounded-3 w-100 border`}
    >
      {heading && (
        <Row className="w-100">
          <Col span={18} className="d-flex flex-column gap-2">
            {/* <ChaiiText className={styles.heading_text}>{heading}</ChaiiText> */}
            <ChaiiText className={styles.dec_text}>{description}</ChaiiText>
          </Col>
          <Col className="d-flex justify-content-end" span={6}>
            <Flex className="me-3">
              <Button
                btnType={btnType}
                disabled={disabled}
                onClick={() => {
                  if (onSave) onSave();
                }}
                label={t("button.next")}
              />
            </Flex>
          </Col>
          {/* <Divider /> */}
        </Row>
      )}
      <Flex>{children}</Flex>
    </Content>
  );
};

export default WhiteCard;
