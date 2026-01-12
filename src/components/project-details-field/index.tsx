import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import ChaiiDateRangeInput from "../date-range-input";
import ChaiInput from "../input";

const ProjectDetailsField = () => {
  const { t } = useTranslation();

  return (
    <Content className="bg-white rounded-1 w-100 p-4">
      <ChaiInput
        name="name"
        rules={[{ required: true, message: t("error.nameRequired") }]}
        label={t("input.name")}
        placeholder={t("placeholder.name")}
      />
      <ChaiiDateRangeInput
        name="tenure"
        rules={[{ required: true, message: t("error.tenureRequired") }]}
        label={t("input.tenure")}
      />
      <ChaiInput
        inputType="textArea"
        name="summary"
        rules={[{ required: true, message: t("error.summaryRequired") }]}
        label={t("input.summary")}
        placeholder={t("placeholder.summary")}
      />
    </Content>
  );
};

export default ProjectDetailsField;
