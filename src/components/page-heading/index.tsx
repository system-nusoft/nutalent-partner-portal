import { Button, Typography } from "antd";
import "./page-heading-styles.scss";

const { Text } = Typography;

interface props {
  title: string;
}

const PageHeading = ({ title }: props) => {
  return (
    <div className="container position-relative z-1">
      <div className="page-heading-div d-flex align-items-center">
        <Text className="page-heading-style">{title}</Text>
        <Button htmlType="submit" />
      </div>
    </div>
  );
};

export default PageHeading;
