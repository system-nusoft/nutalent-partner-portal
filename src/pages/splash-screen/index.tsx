import { Typography } from "antd";
import { SplashScreenTemplate } from "nusoft_components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Logo } from "src/assets/svg";
import { ROUTES } from "src/constants/navigation-routes";
import bg from "../../assets/images/background.png";
import styles from "./splash-screen-styles.module.scss";

const { Text } = Typography;
export const SplashScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 3000);
  }, []);
  return (
    <SplashScreenTemplate backgroundImagePath={bg}>
      <div
        className={`${styles.text_div_splash} d-flex flex-column align-items-center justify-content-center h-100"`}
      >
        <Logo />
        <Text className={styles.splash_text}>{t("heading.slogan")}</Text>
      </div>
    </SplashScreenTemplate>
  );
};
