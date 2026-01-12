import { Flex, Form, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { AuthScreenTemplate, Button, ChaiiText } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo } from "src/assets/svg";
import ChaiInput from "src/components/input";
import LinkText from "src/components/link-text";
import { Notification } from "src/components/notification";
import { ROUTES } from "src/constants/navigation-routes";
import { passwordStateLoading } from "src/store/selectors/features/password-selector";
import RequestAuthAction from "src/store/slices/auth-actions";
import bg from "../../../assets/images/background.png";
import "./styles.module.scss";
const { Text } = Typography;

interface formProps {
  email: string;
  password: string;
}
export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = useForm();
  const isLoading = useSelector(passwordStateLoading);

  const handleForgotPassword = ({ email }: formProps) => {
    dispatch(
      RequestAuthAction.handleForgotPassword({
        email,
        cbSuccess: (res: any) => {
          Notification({ type: "success", message: res?.message });
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 500);
        },
      })
    );
  };

  return (
    <AuthScreenTemplate
      backgroundImagePath={bg}
      logoPath={<Logo />}
      sloganText={t("auth.slogan")}
      copyrightText={t("heading.copyright")}
    >
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={handleForgotPassword} name="login">
          <Content className="d-flex align-items-center justify-center">
            <Flex
              className="main-login-div d-inline-flex flex-column align-items-center"
              gap={"middle"}
              vertical
            >
              <Flex
                vertical
                className="heading-login-div d-flex flex-column align-items-center"
              >
                <Text className="heading-login">
                  {t("forgotPassword.heading")}
                </Text>
                <Text className="des-login">
                  {t("forgotPassword.description")}
                </Text>
              </Flex>
              <Flex
                className="btn-div-login d-inline-flex flex-column align-items-center"
                gap={"middle"}
                vertical
              >
                <div className="input-div-login d-flex flex-column align-items-center">
                  <ChaiInput name="email" placeholder={t("input.email")} />
                </div>
                <div className="btn-view-login d-flex flex-column align-items-center">
                  <Button
                    btnClass="filledBtnLarge"
                    label={t("button.submit")}
                    btnType="submit"
                  />
                  <div className={"d-flex gap-2"}>
                    <LinkText
                      description={t("forgotPassword.click")}
                      link={`${t("forgotPassword.here")}`}
                      onClick={() => navigate(ROUTES.LOGIN)}
                    />
                    <ChaiiText className="des-login">
                      {t("forgotPassword.toLogin")}
                    </ChaiiText>
                  </div>
                </div>
              </Flex>
            </Flex>
          </Content>
        </Form>
      </Spin>
    </AuthScreenTemplate>
  );
};
