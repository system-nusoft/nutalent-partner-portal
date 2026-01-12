import { Form, Select, Tag } from "antd";
import { DefaultOptionType, SelectProps } from "antd/es/select";
import { ChaiiText } from "nusoft_components";
import styles from "./styles.module.scss";

interface inputProps {
  name: string;
  placeholder?: string;
  label?: string;
  disable?: boolean;
  style?: React.CSSProperties;
  initialValue?: string;
  steric?: boolean;
  rules?: any[];
  onChange?: (val: any) => void;
  value?: any;
  options: DefaultOptionType[] | undefined;
  mode?: "multiple" | "tags" | undefined;
  optionRender?:
    | ((oriOption: any, info: { index: number }) => ReactNode)
    | undefined;
  labelRender?: ((props: any) => ReactNode) | undefined;
}

export const filterOption: any = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().startsWith(input.toLowerCase());

export const Dropdown = ({
  name = "test",
  placeholder,
  label,
  disable,
  initialValue,
  style,
  rules,
  onChange,
  value,
  options,
  mode,
  optionRender,
  labelRender,
}: inputProps) => {
  const sharedProps: SelectProps = {
    mode: mode,
    style: { width: "100%" },
    maxTagCount: "responsive",
  };

  return (
    <Form.Item
      rules={rules}
      label={
        label ? (
          <span className={styles.labelMargin}>
            <ChaiiText className={styles.inputLabelStyle}>{label}</ChaiiText>
          </span>
        ) : null
      }
      initialValue={initialValue}
      labelCol={{ span: label ? 24 : 0 }}
      className={styles.formDiv}
      name={name}
    >
      <Select
        filterOption={filterOption}
        showSearch
        tagRender={(val) => (
          <div>
            <Tag>{val.value && val.value?.slice(0, 3)}</Tag>
          </div>
        )}
        placeholder={placeholder}
        {...sharedProps}
        className={styles.rangeInputContainer}
        onChange={onChange}
        style={style}
        labelRender={labelRender}
        disabled={disable}
        optionRender={optionRender}
        value={value}
        options={options}
      />
    </Form.Item>
  );
};
