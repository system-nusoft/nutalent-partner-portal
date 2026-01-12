import { Typography } from "antd";
import "./styles.scss";

interface props {
  description?: string;
  onClick?: () => void;
  link?: string;
  br?: React.ReactNode;
}
const LinkText = ({ description, link, onClick, br }: props) => {
  return (
    <Typography.Text className="light-text text-center">
      {description}
      {br ? <br /> : "\t"}
      <Typography.Text onClick={onClick} className="link-text">
        {link}
      </Typography.Text>
    </Typography.Text>
  );
};

export default LinkText;
