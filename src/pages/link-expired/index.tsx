import { Typography } from "antd";
import { Button, SplashScreenTemplate } from "nusoft_components";
import { useTranslation } from "react-i18next";
import backgroundImage from "src/assets/images/background-link-expired.png";
import { Logo } from "src/assets/svg";
import styles from "./link-expired-styles.module.scss";

const { Text } = Typography;
export const LinkExpired = () => {
  const { t } = useTranslation();
  return (
    <SplashScreenTemplate backgroundImagePath={backgroundImage}>
      <div
        className={`${styles.text_div_link} d-flex flex-column align-items-center justify-content-center`}
      >
        <Logo />
        <div
          className={`${styles.btn_div_link} d-flex flex-column align-items-center`}
        >
          <Text className={styles.text_link}>{t("heading.linkExpired")}</Text>
          <Button
            btnClass="filledBtnLarge"
            label={t("button.requestNewLink")}
          />
        </div>
      </div>
    </SplashScreenTemplate>
  );
};
