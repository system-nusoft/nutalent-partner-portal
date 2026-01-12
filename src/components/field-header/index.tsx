import { Flex, Typography } from "antd";
import "./field-header.scss";

interface props {
  title?: string;
}

const { Text } = Typography;

const FieldHeader = ({ title = "Heading" }: props) => {
  return (
    <Flex className="field-header-container w-100 d-flex  align-items-start">
      <Flex className="field-header-heading-container d-flex align-items-center">
        <Text className="field-header-heading">{title}</Text>
      </Flex>
    </Flex>
  );
};

export default FieldHeader;
