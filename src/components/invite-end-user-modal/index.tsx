import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { Modal } from "nusoft_components";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { inviteEndUserLoading } from "src/store/selectors/features/invite-end-user";
import RequestAppAction from "src/store/slices/app-actions";
import ChaiInput from "../input";
import { Notification } from "../notification";

interface props {
  page: number;
  search: string;
}

const InviteEndUserModal = forwardRef(({ page, search }: props, ref: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm();
  const isLoading = useSelector(inviteEndUserLoading);

  const invite = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        dispatch(
          RequestAppAction.handleInviteEndUser({
            data: values,
            cbSuccess: () => {
              const query = {
                page,
                search: search || undefined,
              };
              dispatch(
                RequestAppAction.handleGetEndUserListing({ query: query })
              );
              Notification({
                type: "success",
                message: t("notification.success"),
              });
              ref?.current?.closeModal();
            },
          })
        );
      })
      .catch(() => {});
  };
  return (
    <Modal
      okText={t("button.invite")}
      heading={t("modal.inviteEndUser")}
      ref={ref}
      isLoading={isLoading}
      onClose={() => form.resetFields()}
      onOk={invite}
    >
      <Form form={form} name="inviteEndUser">
        <ChaiInput
          name="email"
          label={t("input.endUserEmail")}
          placeholder={t("placeholder.email")}
          rules={[
            { message: t("error.emailRequired"), required: true },
            {
              type: "email",
              message: t("error.validEmail"),
            },
          ]}
        />
      </Form>
    </Modal>
  );
});

export default InviteEndUserModal;
