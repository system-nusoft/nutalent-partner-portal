import { Form, TimePicker } from "antd";
import { ChaiiText } from "nusoft_components";
import React from "react";
import styles from "./styles.module.scss";
const { RangePicker } = TimePicker;

interface inputProps {
  name: string;
  placeholder?: [string, string];
  label?: string;
  disable?: boolean;
  style?: React.CSSProperties;
  initialValue?: string;
  steric?: boolean;
  rules?: any[];
  onChange?: (val: any) => void;
}

export const TimeRangePicker = ({
  name = "test",
  placeholder,
  label,
  disable,
  initialValue,
  style,
  steric = false, // Default value is false
  rules,
  onChange,
}: inputProps) => {
  return (
    <Form.Item
      label={
        <span className="margin-bottom-negative">
          {steric && <ChaiiText className={styles.steric}>*</ChaiiText>}
          <ChaiiText className={styles.input_label_style}>{label}</ChaiiText>
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      initialValue={initialValue}
      className={styles.form_div}
      name={name}
      rules={rules}
    >
      <RangePicker
        style={style}
        disabled={disable}
        onChange={onChange}
        format={"h:mm A"}
        className={`
            ${styles.inputStyles}
            `}
        showSecond={false}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};
