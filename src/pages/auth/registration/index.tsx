import { Flex, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { AuthScreenTemplate, Button } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ClosedEye, Eye, Logo } from "src/assets/svg";
import ChaiInput from "src/components/input";
import LinkText from "src/components/link-text";
import { ROUTES } from "src/constants/navigation-routes";
import bg from "../../../assets/images/background.png";
import "./styles.scss";

const { Text } = Typography;
export const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthScreenTemplate
      backgroundImagePath={bg}
      logoPath={<Logo />}
      sloganText={t("auth.slogan")}
      copyrightText={t("heading.copyright")}
    >
      <Content className="d-inline-flex align-items-center justify-center">
        <Flex
          className="main-div d-flex flex-column align-items-center"
          gap={"middle"}
          vertical
        >
          <Flex
            vertical
            className="heading-div d-flex flex-column align-items-center"
          >
            <Text className="heading">{t("signUp.heading")}</Text>
            <Text className="des">{t("signUp.description")}</Text>
          </Flex>
          <Flex
            className="btn-div d-inline-flex flex-column align-items-center"
            gap={"middle"}
            vertical
          >
            <div className="input-div d-flex flex-column align-items-center">
              <ChaiInput
                name="password"
                type="password"
                suffix={<Eye />}
                placeholder={t("input.newPassword")}
              />
              <ChaiInput
                name="password"
                type="password"
                suffix={<ClosedEye />}
                placeholder={t("input.confirmPassword")}
              />
            </div>
            <div className="btn-view d-flex flex-column align-items-center">
              <Button btnClass="filledBtnLarge" label={t("button.submit")} />
              <LinkText
                onClick={handleGoBack}
                description={t("signUp.alreadyHaveAccount")}
                br
                link={t("heading.signIn")}
              />
            </div>
          </Flex>
        </Flex>
      </Content>
    </AuthScreenTemplate>
  );
};
