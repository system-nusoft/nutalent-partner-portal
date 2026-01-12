import { Form, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { Content } from "antd/es/layout/layout";
import { Button } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import RequestAppAction from "src/store/slices/app-actions";
import ChaiInput from "../input";
import { Notification } from "../notification";

const AccountResetPasswordFields = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const onFinish = (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (!oldPassword || !newPassword || !confirmPassword) {
      Notification({
        type: "error",
        message: t("notification.fillAllFields"),
      });
      return;
    }

    if (confirmPassword !== newPassword) {
      Notification({
        type: "error",
        message: t("notification.passwordDoNotMatch"),
      });
    } else {
      dispatch(
        RequestAppAction.handleUpdatePassword({
          currentPassword: oldPassword,
          newPassword: newPassword,
          cbSuccess: () => {
            Notification({
              type: "success",
              message: t("notification.success"),
            });
            form.resetFields();
          },
        })
      );
    }
  };
  return (
    <Content className="d-flex gap-3 px-5  flex-column mt-5 pb-5 mb-2 align-items-center h-100">
      <Form onFinish={onFinish} form={form} name="accountResetPassword">
        <ChaiInput
          label={t("input.previousPassword")}
          // previousPassword
          name="oldPassword"
          placeholder={t("placeholder.password")}
          inputType="password"
        />
        <ChaiInput
          name="newPassword"
          label={t("input.newPassword")}
          placeholder={t("placeholder.password")}
          inputType="password"
        />
        <ChaiInput
          name="confirmPassword"
          label={t("input.confirmPassword")}
          placeholder={t("placeholder.password")}
          inputType="password"
        />
        <Space className="pt-2">
          <Button label="Update" btnType="submit" />
        </Space>
      </Form>
    </Content>
  );
};

export default AccountResetPasswordFields;
