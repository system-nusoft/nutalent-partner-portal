import { Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { Modal } from "nusoft_components";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { invitePartnerLoading } from "src/store/selectors/features/invite-partner";
import RequestAppAction from "src/store/slices/app-actions";
import ChaiInput from "../input";
import { Notification } from "../notification";

interface props {
  page: number;
  search: string;
}

const InvitePartnerModal = forwardRef(({ page, search }: props, ref: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm();
  const isLoading = useSelector(invitePartnerLoading);

  const invite = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        dispatch(
          RequestAppAction.handleInvitePartner({
            data: values,
            cbSuccess: () => {
              const query = {
                page,
                search: search || undefined,
              };
              dispatch(RequestAppAction.handleGetPartners({ query: query }));
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
      heading={t("modal.invitePartner")}
      ref={ref}
      isLoading={isLoading}
      onClose={() => form.resetFields()}
      onOk={invite}
    >
      <Form form={form} name="invitePartner">
        <ChaiInput
          name="email"
          label={t("input.partnerEmail")}
          placeholder={t("placeholder.email")}
          rules={[
            { message: t("error.emailRequired"), required: true },
            {
              type: "email",
              message: t("error.validEmail"),
            },
          ]}
        />
        <ChaiInput
          name="companyName"
          label={t("input.companyName")}
          placeholder={t("placeholder.company")}
          rules={[{ message: t("error.companyNameRequired"), required: true }]}
        />
        <ChaiInput
          name="recoveryEmail"
          label={t("input.recoveryEmail")}
          placeholder={t("placeholder.email")}
          rules={[
            { message: t("error.recoveryEmailRequired"), required: true },
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

export default InvitePartnerModal;
