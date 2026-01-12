import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Input as AntInput,
  Form,
  InputNumber,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { ClosedEye, Eye } from "src/assets/svg";
import { colors } from "src/styles/colors";
import styles from "./styles.module.scss";

interface inputProps {
  suffix?: React.ReactNode;
  name: string;
  placeholder?: string;
  type?: "password" | "input";
  label?: string;
  disable?: boolean;
  maxLength?: number;
  height?: "middle" | "large" | "small";
  style?: React.CSSProperties;
  initialValue?: string;
  minLength?: number | string;
  steric?: boolean;
  inputType?: "normal" | "textArea" | "number" | "password";
  rules?: any[];
  onChange?: (val: any) => void;
  onlyNumbers?: boolean;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  prefix?: React.ReactNode | string;
  size?: "large" | "middle" | "small";
  rows?: number;
  value?: string | number;
  onClick?: () => void;
  min?: number | undefined;
  max?: number | undefined;
  labelToolTip?: string;
}

const { Text } = Typography;

const ChaiInput = ({
  suffix,
  name = "test",
  placeholder,
  type,
  label,
  disable,
  inputType = "normal",
  height = "middle",
  initialValue,
  style,
  min,
  max,
  steric = false, // Default value is false
  rules,
  onChange,
  maxLength,
  onPressEnter,
  onlyNumbers,
  rows = 6,
  prefix,
  value,
  size = "middle",
  onClick,
  labelToolTip,
}: inputProps) => {
  return (
    <Form.Item
      label={
        <span className="margin-bottom-negative">
          {steric && <Text className={styles.steric}>*</Text>}
          <Text className={styles.input_label_style}>{label}</Text>
          {labelToolTip ? (
            <Tooltip
              color={colors.primary}
              title={labelToolTip}
              className="ms-1"
            >
              <InfoCircleOutlined />
            </Tooltip>
          ) : (
            <></>
          )}
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      initialValue={initialValue}
      className={styles.form_div}
      name={name}
      rules={rules}
    >
      {inputType === "textArea" ? (
        <TextArea
          showCount={height !== "small"}
          rows={rows}
          autoComplete="none"
          maxLength={maxLength}
          disabled={disable}
          onChange={onChange}
          value={value}
          size={size}
          placeholder={placeholder}
          style={{
            color: colors.textColor,
            width: "100%",
            ...style,
          }}
        />
      ) : inputType === "number" ? (
        <InputNumber
          disabled={disable}
          autoComplete="none"
          defaultValue={initialValue}
          placeholder={placeholder}
          prefix={prefix}
          value={value}
          onKeyDown={(event) => {
            if (onlyNumbers) {
              if (
                !/[0-9]/.test(event.key) &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Tab"
              ) {
                if (event.key !== "Backspace") event.preventDefault();
              }
            }
          }}
          onChange={onChange}
          className={`
          ${styles.inputStyles}
          `}
          min={min}
          max={max}
        />
      ) : inputType === "password" || type === "password" ? (
        <AntInput.Password
          disabled={disable}
          autoComplete="none"
          type="password"
          defaultValue={initialValue}
          iconRender={(visible) => (visible ? <ClosedEye /> : <Eye />)}
          placeholder={placeholder}
          prefix={prefix}
          onChange={onChange}
          className={`
           ${styles.inputStyles}
            d-flex align-items-center
          `}
        />
      ) : (
        <AntInput
          disabled={disable}
          type={type}
          autoComplete="none"
          onClick={onClick}
          prefix={prefix}
          defaultValue={initialValue}
          placeholder={placeholder}
          onChange={onChange}
          onPressEnter={onPressEnter}
          suffix={suffix}
          onKeyDown={(event) => {
            if (onlyNumbers) {
              if (
                !/[0-9]/.test(event.key) &&
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Tab"
              ) {
                if (event.key !== "Backspace") event.preventDefault();
              }
            }
          }}
          className={`${styles.inputStyles} d-flex align-items-center `}
        />
      )}
    </Form.Item>
  );
};

export default ChaiInput;
