import { Tooltip } from "antd";
import { colors } from "src/styles/colors";
import styles from "./styles.module.scss";

interface props {
  color?: "grey" | "green" | "blue";
  icon?: React.ReactNode;
  text?: string;
  toolTip?: string;
}

export const RoundTag = ({ color = "grey", icon, text, toolTip }: props) => {
  return (
    <Tooltip color={colors.primary} title={toolTip}>
      <div
        className={`flex gap-1 p-2 cursor-default items-center justify-center ${
          styles[`tag_${color}`]
        }`}
      >
        {icon} {text}
      </div>
    </Tooltip>
  );
};
