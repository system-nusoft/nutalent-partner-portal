import { Space } from "antd";
import { Button } from "nusoft_components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isPartner } from "src/services/user-type";
import { getPartnerData } from "src/store/selectors/features/get-partner";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import ChaiInput from "../input";

const AccountSetupInputs = () => {
  const { t } = useTranslation();
  const user: any = useSelector(getCurrentUserData);
  const partner: any = useSelector(getPartnerData);
  return (
    <>
      <ChaiInput
        placeholder={t("placeholder.name")}
        label={t("input.firstName")}
        name="firstName"
        initialValue={user?.firstName}
        disable={isPartner() ? false : true}
      />
      <ChaiInput
        placeholder={t("placeholder.lastName")}
        label={t("input.lastName")}
        name="lastName"
        initialValue={user?.lastName}
        disable={isPartner() ? false : true}
      />
      <ChaiInput
        disable
        placeholder={t("placeholder.email")}
        name="email"
        label={t("input.email")}
        initialValue={user?.email}
      />
      {isPartner() ? (
        <>
          <ChaiInput
            placeholder={t("placeholder.enterWebsite")}
            name="websiteURL"
            initialValue={partner?.websiteURL}
            label={t("input.partnerWebsite")}
          />
          {/* will show recoveryEmail for only partner user Type */}
          <ChaiInput
            disable
            placeholder={t("placeholder.recoveryEmail")}
            name="recoveryEmail"
            initialValue={partner?.recoveryEmail}
            label={t("input.recoveryEmail")}
          />
        </>
      ) : (
        <ChaiInput
          disable
          placeholder={t("placeholder.phoneNumber")}
          name="phoneNumber"
          label={t("input.phoneNumber")}
          initialValue={user?.phoneNumber}
        />
      )}
      {/* will show website for only partner user Type */}

      <Space className="mt-2 w-100">
        <Button
          disabled={isPartner() ? false : true}
          label={t("button.submit")}
          btnType="submit"
        />
      </Space>
    </>
  );
};

export default AccountSetupInputs;
