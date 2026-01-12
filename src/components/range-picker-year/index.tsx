import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { ChaiiText } from "nusoft_components";
import styles from "./styles.module.scss";

interface Props {
  label?: string;
  name: string;
  rules?: [{ required: boolean; message: string }];
  initialValue?: any;
  placeholder?: string;
  disabled?: boolean;
  disabledDate?: (current: dayjs.Dayjs) => boolean;
  onChange?: any;
  type?: "date" | "year";
}

const NuDatePicker = ({
  rules,
  label,
  name,
  placeholder,
  disabled,
  disabledDate,
  onChange,
  type = "date",
}: Props) => {
  return (
    <Form.Item
      rules={rules}
      getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
      label={
        label ? (
          <span className={styles.labelMargin}>
            <ChaiiText className={styles.inputLabelStyle}>{label}</ChaiiText>
          </span>
        ) : null
      }
      labelCol={{ span: label ? 24 : 0 }}
      className={styles.formDiv}
      name={name}
    >
      {type === "date" ? (
        <DatePicker
          disabledDate={disabledDate}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`d-flex align-items-center ${styles.rangeInputContainer}`}
        />
      ) : (
        <DatePicker.YearPicker
          disabledDate={disabledDate}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`d-flex align-items-center ${styles.rangeInputContainer}`}
        />
      )}
    </Form.Item>
  );
};

export default NuDatePicker;
