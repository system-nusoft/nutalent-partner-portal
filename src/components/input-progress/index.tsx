import { Col, Flex, Row, StepProps, Steps } from "antd";
import { Button } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styles from "./input-progress.module.scss";
interface progressProps {
  current?: number;
  labels: StepProps[];
  onClick: (val: number) => void;
  onClickNext?: () => void;
  success?: boolean;
  disabledBackBtn?: boolean;
  onClickBack?: () => void;
}

const InputProgress = ({
  current,
  labels,
  onClick,
  onClickNext,
  success,
  onClickBack,
}: progressProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Flex
      className={`d-flex pb-3   align-items-center  pt-4 justify-content-around ${styles.main_view}`}
    >
      <Row className="w-100 border d-flex p-2 align-items-center justify-content-between gap-2 bg-light rounded-3">
        <Col>
          <Button
            label={t("button.back")}
            btnType={"button"}
            disabled={current === 0 || success}
            onClick={onClickBack}
          />
        </Col>
        <Col>
          <Steps current={current} onChange={onClick} items={labels} />
        </Col>
        <Col>
          <Button
            label={t("button.submit")}
            btnType={"button"}
            disabled={success || labels?.length - 1 !== current}
            onClick={onClickNext}
          />
        </Col>
      </Row>
    </Flex>
  );
};

export default InputProgress;
