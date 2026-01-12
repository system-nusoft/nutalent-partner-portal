import { DatePicker, Form } from "antd";
import { ChaiiText } from "nusoft_components";
import "./range-input-styles.scss";

const { RangePicker } = DatePicker;

interface props {
  label?: string;
  name: string;
}

const ChaiiDateRange = ({ label, name }: props) => {
  return (
    <Form.Item
      label={
        <span style={{ marginBottom: "-0.8rem" }}>
          <ChaiiText className="input-label-style">{label}</ChaiiText>
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      className="form-div"
      name={name}
    >
      <RangePicker className="range-input-container d-flex align-items-center" />
    </Form.Item>
  );
};

export default ChaiiDateRange;
