import { DatePicker, Form, Typography } from "antd";
import styles from "./styles.module.scss";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface Props {
  label?: string;
  name: string;
  rules?: [{ required: boolean; message: string }];
  disable?: boolean;
}

const ChaiiDateRangeInput = ({ label, name, rules, disable }: Props) => {
  return (
    <Form.Item
      rules={rules}
      label={
        label ? (
          <span className={styles.labelMargin}>
            <Text className={styles.inputLabelStyle}>{label}</Text>
          </span>
        ) : null
      }
      labelCol={{ span: label ? 24 : 0 }}
      className={styles.formDiv}
      name={name}
    >
      <RangePicker
        format={"MM-YYYY"}
        disabled={disable}
        className={`d-flex align-items-center ${styles.rangeInputContainer}`}
      />
    </Form.Item>
  );
};

export default ChaiiDateRangeInput;
