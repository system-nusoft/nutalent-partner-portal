import { Flex, Form, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import MultiSelect from "../chaii-multi-select";

const ProjectAssignResourceField = () => {
  const { t } = useTranslation();
  return (
    <Content className="bg-white rounded-1 w-100 p-4">
      <Form>
        <Flex className="w-100 mt-3">
          <MultiSelect
            rules={[{ required: true, message: t("error.skillsRequired") }]}
            options={[{ label: "string", option: "test" }]}
            tagRender={(val) => <Tag color="blue">{val?.label}</Tag>}
            name="skills"
            placeholder={t("placeholder.skills")}
          />
        </Flex>
      </Form>
    </Content>
  );
};

export default ProjectAssignResourceField;
