import { notification } from "antd";
import styles from "./styles.module.scss";

interface notificationProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
}

export const Notification = ({
  type = "success",
  message,
}: notificationProps) => {
  return notification.open({
    message: message,
    pauseOnHover: true,
    closable: false,
    duration: 2,
    placement: "top",
    description: null,
    className: `${styles[`body_styles_${type}`]} rounded-1`,
  });
};
