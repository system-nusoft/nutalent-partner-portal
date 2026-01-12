import { Button, Typography } from "antd";
import "./styles.scss";
interface ButtonProps {
  btn_class?: "filled_btn_large" | "filled_btn" | "white_btn";
  label?: string;
  btn_Type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent) => void;
}

const { Text } = Typography;
const ChaiiButton = ({
  btn_class = "filled_btn",
  label = "Button",
  btn_Type = "button",
  onClick,
}: ButtonProps) => {
  return (
    <Button onClick={onClick} htmlType={btn_Type} className={`${btn_class} d-flex justify-content-center align-items-center`}>
      <Text className="btn_text text-center ">{label}</Text>
    </Button>
  );
};

export default ChaiiButton;
