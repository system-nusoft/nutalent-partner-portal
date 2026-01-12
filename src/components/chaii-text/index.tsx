import { Typography } from "antd";
import React from "react";

interface props {
  className?: string;
  children?: React.ReactNode | string;
}

const ChaiiText = ({ className, children }: props) => {
  return <Typography.Text className={className}>{children}</Typography.Text>;
};

export default ChaiiText;
