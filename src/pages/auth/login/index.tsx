import { Flex, Form, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { AuthScreenTemplate, Button } from "nusoft_components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo } from "src/assets/svg";
import ChaiInput from "src/components/input";
import LinkText from "src/components/link-text";
import { ROUTES } from "src/constants/navigation-routes";
import { authenticationLoading } from "src/store/selectors/features/authentication";
import RequestAuthAction from "src/store/slices/auth-actions";
import { toggleClearLogin } from "src/store/slices/features/authReducer";
import bg from "../../../assets/images/background.png";
import "./login-styles.scss";
const { Text } = Typography;

interface formProps {
  email: string;
  password: string;
}
export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = useForm();
  const isLoading = useSelector(authenticationLoading);

  const handleLogin = ({ email, password }: formProps) => {
    dispatch(
      RequestAuthAction.handleLogin({
        email,
        password,
        t,
        cbSuccess: () => {
          navigate(ROUTES.PROFILE);
        },
      })
    );
  };

  useEffect(() => {
    dispatch(toggleClearLogin());
  }, []);

  return (
    <AuthScreenTemplate
      backgroundImagePath={bg}
      logoPath={<Logo />}
      sloganText={t("auth.slogan")}
      copyrightText={t("heading.copyright")}
    >
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={handleLogin} name="login">
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
                <Text className="heading-login">{t("login.heading")}</Text>
                <Text className="des-login">{t("login.description")}</Text>
              </Flex>
              <Flex
                className="btn-div-login d-inline-flex flex-column align-items-center"
                gap={"middle"}
                vertical
              >
                <div className="input-div-login d-flex flex-column align-items-center">
                  <ChaiInput name="email" placeholder={t("input.email")} />
                  <ChaiInput
                    name="password"
                    type="password"
                    placeholder={t("input.password")}
                  />
                </div>
                <div className="btn-view-login d-flex flex-column align-items-center">
                  <Button
                    btnClass="filledBtnLarge"
                    label={t("button.signIn")}
                    btnType="submit"
                  />
                  <LinkText
                    description={t("login.resetPasswordDesc")}
                    br
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    link={`${t("heading.forgotPassword")}`}
                  />
                </div>
              </Flex>
            </Flex>
          </Content>
        </Form>
      </Spin>
    </AuthScreenTemplate>
  );
};
