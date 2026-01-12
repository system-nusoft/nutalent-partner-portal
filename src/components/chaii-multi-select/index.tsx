import { Form, Select, SelectProps, Tooltip } from "antd";
import { ChaiiText } from "nusoft_components";
import styles from "./styles.module.scss";
import { colors } from "src/styles/colors";

interface props {
  size?: "middle" | "large" | "small";
  defaultValue?: string;
  name: string;
  label?: string;
  options: any;
  placeholder?: string;
  disabled?: boolean;
  rules?: [{ required: boolean; message: string }];
  tagRender?: SelectProps["tagRender"];
}

export const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().startsWith(input.toLowerCase());

const MultiSelect = ({
  size = "middle",
  defaultValue,
  name,
  label,
  options,
  placeholder,
  disabled,
  rules,
  tagRender,
}: props) => {
  const sharedProps: SelectProps = {
    style: { width: "100%" },
    options,
    maxTagCount: "responsive",
    filterOption: (input, option: any) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
  };
  return (
    <Form.Item
      rules={rules}
      label={
        <span className={styles.margin_bottom_negative}>
          <ChaiiText className={styles.input_label_style}>{label}</ChaiiText>
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      className={styles.form_div}
      name={name}
    >
      <Select
        {...sharedProps}
        mode="multiple"
        size={size}
        showSearch
        placeholder={placeholder}
        defaultValue={defaultValue}
        onSelect={(val) => val}
        tagRender={tagRender}
        disabled={disabled}
        className={styles.multiSelect}
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip
            placement="top"
            color="white"
            overlayInnerStyle={{
              maxWidth: "30rem",
              backgroundColor: colors.white,
              padding: '0.75rem',
              borderRadius: '0.5rem',
            }}
            title={
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '30rem' }}>
                {omittedValues.map(({ label }, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: colors.skillsBlueBg,
                      color: colors.primary,
                      border: `1px solid ${colors.skillsBlueBorder}`,
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '0.25rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            }
          >
            <span>+{omittedValues.length}...</span>
          </Tooltip>
        )}
      />
    </Form.Item>
  );
};

export default MultiSelect;
