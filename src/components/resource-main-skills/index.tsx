import { Flex, Form, Spin, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getAddResourceFields } from "src/store/selectors/features/add-resource-fields";
import { getResourceByIdData } from "src/store/selectors/features/get-resource-by-id";
import { getSkillsData } from "src/store/selectors/features/get-skills-selector";
import { getPostSkillLoading } from "src/store/selectors/features/post-skill-selector";
import RequestAppAction from "src/store/slices/app-actions";
import MultiSelect from "../chaii-multi-select";
import WhiteCard from "../white-card";

interface props {
  onSuccess: () => void;
}

const ResourceMainSkills: React.FC<props> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const skills: any = useSelector(getSkillsData);
  const dispatch = useDispatch();
  const isLoading = useSelector(getPostSkillLoading);
  const fields: any = useSelector(getAddResourceFields);
  const field = "skill";
  const location = useLocation();
  const pathname = location.pathname;
  const hasEdit = pathname.includes("edit");
  const data: any = useSelector(getResourceByIdData);

  useEffect(() => {
    const ResourceSkills = data?.ResourceSkills;
    if (Array.isArray(ResourceSkills) && ResourceSkills?.length > 0) {
      form.setFieldsValue({
        skills: ResourceSkills?.map((value: any) => {
          if (value?.skills) {
            return {
              label: value?.skills?.name,
              value: value?.skills?.id,
            };
          } else {
            return {
              label: value?.skill?.name,
              value: value?.skill?.id,
            };
          }
        }),
      });
    }
    if (hasEdit) {
      setTimeout(() => {
        form.validateFields().catch(() => {});
      }, 200);
    }
  }, []);

  const onSave = (e: any) => {
    const transformedSkills = e.skills?.map((skillValue: any) => {
      if (skillValue?.value) {
        return {
          skillId: skillValue?.value,
          label: skillValue?.label, // You can include label here if needed
          yearsOfExperience: 0, // temp
        };
      } else {
        const skillOption = skills.find(
          (option: { id: string }) => option?.id === skillValue
        );

        return {
          skillId: skillValue,
          label: skillOption?.name, // You can include label here if needed
          yearsOfExperience: 0, // temp
        };
      }
    });

    dispatch(
      RequestAppAction.handlePostSkill({
        id: data?.id,
        data: {
          skills: transformedSkills?.map((val: any) => ({
            skillId: val?.skillId,
            yearsOfExperience: 0, //temp
          })),
        },
        cbSuccess: () => {
          setTimeout(() => {
            onSuccess();
          }, 100);

          dispatch(
            RequestAppAction.handleGetResourceById({
              id: data?.id,
              cbSuccess: () => {},
            })
          );
        },
      })
    );
  };

  const getSkills = () => {
    dispatch(RequestAppAction.handleGetSkills());
  };

  useEffect(() => {
    if (!Array.isArray(skills)) {
      getSkills();
    }
  }, []);

  return (
    <Form form={form} className="w-100" onFinish={onSave}>
      <Spin spinning={isLoading}>
        <WhiteCard
          heading={t("profileReview.skills")}
          description={t("tab.skillsDesc")}
          disabled={!data?.id}
          onSave={() => form.submit()}
        >
          <Flex className="w-100 mt-3">
            <MultiSelect
              rules={[{ required: true, message: t("error.skillsRequired") }]}
              options={skills?.map((item: any) => ({
                label: item?.name,
                value: item?.id,
              }))}
              tagRender={(val) => (
                <Tag
                  color="blue"
                  closable
                  onClose={() => {
                    const arr = form.getFieldValue("skills");
                    if (Array.isArray(arr) && arr?.length > 0) {
                      const filtered = arr?.filter(
                        (i: any) => i?.value !== val?.value
                      );
                      form.setFieldsValue({
                        skills: filtered,
                      });
                    }
                  }}
                >
                  {val?.label}
                </Tag>
              )}
              name="skills"
              disabled={!data?.id}
              placeholder={t("placeholder.skills")}
            />
          </Flex>
        </WhiteCard>
      </Spin>
    </Form>
  );
};

export default ResourceMainSkills;
