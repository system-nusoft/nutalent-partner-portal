import { Flex, Form, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { AuthScreenTemplate, Button } from "nusoft_components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "src/assets/svg";
import ChaiInput from "src/components/input";
import { Notification } from "src/components/notification";
import { ROUTES } from "src/constants/navigation-routes";
import { passwordStateLoading } from "src/store/selectors/features/password-selector";
import { verifyPartnerLoading } from "src/store/selectors/features/verify-partner-token";
import RequestAppAction from "src/store/slices/app-actions";
import RequestAuthAction from "src/store/slices/auth-actions";
import bg from "../../../assets/images/background.png";
import "./styles.module.scss";
import { PASSWORDREGEX } from "src/constants/constant-values";
const { Text } = Typography;

interface formProps {
  email: string;
  password: string;
}
export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = useForm();
  const isLoading: any = useSelector(passwordStateLoading);
  const isVerifying = useSelector(verifyPartnerLoading);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const token = params.get("token");

  const onFinish = (values: { newPassword: string }) => {
    const { newPassword } = values;
    if (token && userId)
      dispatch(
        RequestAuthAction.handleResetPassword({
          token: token,
          userId: userId,
          password: newPassword,
          cbSuccess: (res: any) => {
            Notification({ type: "success", message: res?.data?.message });
            setTimeout(() => {
              navigate(ROUTES.LOGIN);
            }, 500);
          },
        })
      );
  };

  const getUrlParams = () => {
    if (token && userId)
      dispatch(
        RequestAppAction.handleVerifyPartnerToken({
          token: token,
          userId,
          cbSuccess: () => {
            //TODO: might use this in future
            // localStorageService
            //   .persist("user", JSON.stringify({ jwtToken: token }))
            //   .then(() => {
            //     dispatch(
            //       RequestAppAction.handleGetPartner({
            //         id: userId,
            //         cbSuccess: (res) => {
            //           form.setFieldsValue({
            //             companyName: res?.companyName,
            //             recoveryEmail: res?.recoveryEmail,
            //             email: res?.users[0]?.email,
            //           });
            //         },
            //       })
            //     );
            //   });
          },
          cbFailure: () => {
            navigate(ROUTES.LOGIN);
          },
        })
      );
    else navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    getUrlParams();
  }, []);

  // const handleLogin = ({ email, password }: formProps) => {
  //   dispatch(
  //     RequestAuthAction.handleLogin({
  //       email,
  //       password,
  //       t,
  //       cbSuccess: () => {
  //         navigate(ROUTES.PROFILE);
  //       },
  //     })
  //   );
  // };

  // useEffect(() => {
  //   dispatch(toggleClearLogin());
  // }, []);

  return (
    <AuthScreenTemplate
      backgroundImagePath={bg}
      logoPath={<Logo />}
      sloganText={t("auth.slogan")}
      copyrightText={t("heading.copyright")}
    >
      <Spin spinning={isLoading || isVerifying}>
        <Form form={form} onFinish={onFinish} name="login">
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
                  {t("resetPassword.heading")}
                </Text>
                <Text className="des-login">
                  {t("resetPassword.description")}
                </Text>
              </Flex>
              <Flex
                className="btn-div-login d-inline-flex flex-column align-items-center"
                gap={"middle"}
                vertical
              >
                <div className="input-div-login d-flex flex-column align-items-center">
                  <ChaiInput
                    name="newPassword"
                    type="password"
                    rules={[
                      { required: true, message: t("error.passwordRequired") },
                      {
                        pattern: PASSWORDREGEX,
                        message: t("error.passwordInvalid"),
                      },
                      {
                        validator: async (_: unknown, value: string) => {
                          const password = form.getFieldValue("confirmPassword");
                          if (value && value !== password && password?.length > 0) {
                            form.setFields([
                              {
                                name: "confirmPassword",
                                errors: [t("error.passwordMismatch")],
                              },
                            ]);
                          } else {
                            form.setFields([
                              {
                                name: "confirmPassword",
                                errors: undefined,
                              },
                            ]);
                          }
                        },
                      },
                    ]}                    
                    placeholder={t("input.newPassword")}
                  />
                  <ChaiInput
                    name="confirmPassword"
                    type="password"
                    placeholder={t("input.confirmPassword")}
                    rules={[
                      { required: true, message: t("error.passwordRequired") },
                      {
                        validator: async (_: unknown, value: string) => {
                          const password = form.getFieldValue("newPassword");
                          if (value && value !== password) {
                            throw new Error(t("error.passwordMismatch"));
                          }
                        },
                      },
                    ]}
                  />
                </div>
                <div className="btn-view-login d-flex flex-column align-items-center">
                  <Button
                    btnClass="filledBtnLarge"
                    label={t("button.submit")}
                    btnType="submit"
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
