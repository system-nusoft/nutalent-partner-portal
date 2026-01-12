import { IssuesCloseOutlined } from "@ant-design/icons";
import { Avatar, Flex, Skeleton, Spin, Tag } from "antd";
import { Content } from "antd/es/layout/layout";
import { Button, ChaiiText } from "nusoft_components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DollarCircle, Lightning } from "src/assets/svg";
import { RoundTag } from "src/components/round-tag";
import { PrivateRoutes } from "src/constants/routes-types";
import {
  getResourceByIdData,
  getResourceByIdLoading,
} from "src/store/selectors/features/get-resource-by-id";
import RequestAppAction from "src/store/slices/app-actions";
import {
  toggleClearCreateResourceData,
  toggleCreateResourceData,
} from "src/store/slices/features/create-resource-value-reducer";
import { formatToMonthYear, getRandomColor } from "src/utils/functions";
import { EducationHistory, WorkExperience } from "src/utils/interfaces";
import st from "./styles.module.scss";

const ResourceProfile: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const profile: any = useSelector(getResourceByIdData);
  const isLoading = useSelector(getResourceByIdLoading);
  const navigate = useNavigate();
  const pathname = location.pathname;
  const match = pathname.match(/resources\/([^/]+)/);
  const id = match ? match[1] : null;

  useEffect(() => {
    if (id) dispatch(RequestAppAction.handleGetResourceById({ id: id }));
  }, []);

  const transparentCard = ({
    heading,
    children,
  }: {
    heading: string;
    children?: React.ReactNode | string;
  }) => {
    return (
      <Flex className="flex-column gap-2 d-flex  align-items-start">
        <ChaiiText className={st.card_heading}>{heading}</ChaiiText>
        {typeof children === "string" ? (
          <ChaiiText className={st.card_desc}>{children}</ChaiiText>
        ) : (
          children
        )}
      </Flex>
    );
  };

  const formmatedSkills = () => {
    const arr = profile?.ResourceSkills ?? [];
    const formattedTechnologies = arr.map(
      (tech: { skills: { name: string } }) => (
        <>
          {tech ? (
            <Tag className={`my-1 ${st.tag}`}>{tech?.skills?.name}</Tag>
          ) : (
            <></>
          )}
        </>
      )
    );

    return formattedTechnologies;
  };

  const onViewEngagements = () => {
    if (location.pathname.includes("partners")) {
      navigate(`${location.pathname}/engagements?${profile?.id}`, {
        state: {
          data: profile,
        },
      });
    } else {
      navigate(
        PrivateRoutes.VIEWRESOURCEBYIDADMIN.replace(":id", profile?.id),
        {
          state: {
            data: profile,
          },
        }
      );
    }
  };
  const onEditProfile = () => {
    if (profile) {
      dispatch(toggleClearCreateResourceData());
      const { id } = profile;
      dispatch(toggleCreateResourceData(id));

      setTimeout(() => {
        if (location?.pathname?.includes("partners")) {
          navigate(location.pathname + "/edit", {
            state: {
              data: profile,
            },
          });
        } else {
          navigate(
            PrivateRoutes.EDIT_RESOURCE_PROFILE.replace(":id", profile?.id),
            {
              state: {
                data: profile,
              },
            }
          );
        }
      }, 200);
    }
  };

  const formatText = (text: string): JSX.Element[] => {
    const lines = text
      .replace(/(?<!\*)\*(?!\*)/g, "\n") // treat * as newlines
      .split(/\n/); // split on every newline

    const result: JSX.Element[] = [];

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();

      if (line === "") {
        // Preserve blank lines as <br />
        result.push(<br key={`br-${index}`} />);
        return;
      }

      let content: React.ReactNode[] = [];
      let workingLine = line;

      // Bullet conversion
      if (workingLine.startsWith("-") || workingLine.startsWith("•")) {
        content.push(<span key={`bullet-${index}`}>• </span>);
        workingLine = workingLine.slice(1).trim();
      }

      // Parse inline styles (**bold**, _italic_)
      const parts = [];
      const regex = /(\*\*(.*?)\*\*|_(.*?)_)/g;
      let lastIndex = 0;
      let match;
      let partIndex = 0;

      while ((match = regex.exec(workingLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(workingLine.slice(lastIndex, match.index));
        }

        if (match[2]) {
          parts.push(
            <strong key={`bold-${index}-${partIndex++}`}>{match[2]}</strong>
          );
        } else if (match[3]) {
          parts.push(
            <em key={`italic-${index}-${partIndex++}`}>{match[3]}</em>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < workingLine.length) {
        parts.push(workingLine.slice(lastIndex));
      }

      content = content.concat(
        parts.map((part, i) =>
          typeof part === "string" ? (
            <span key={`text-${index}-${i}`}>{part}</span>
          ) : (
            part
          )
        )
      );

      result.push(<div key={`line-${index}`}>{content}</div>);
    });

    return result;
  };

  return (
    <Content className="h-100 w-100  px-5">
      <Spin spinning={isLoading}>
        <Content className="h-100 w-100 flex-column d-flex gap-4 px-2 pb-5 px-5 ">
          {isLoading ? (
            <Skeleton paragraph={{ rows: 20 }} loading title />
          ) : (
            <>
              {" "}
              <Flex gap={12} justify="space-between">
                <Flex gap={12}>
                  <div>
                    {profile?.profilePicture ? (
                      <Avatar size={64} src={profile?.profilePicture}></Avatar>
                    ) : (
                      <Avatar
                        style={{
                          background: getRandomColor(
                            profile?.firstName?.charAt(0)
                          ),
                        }}
                        size={64}
                      >
                        {profile?.firstName?.charAt(0)}
                      </Avatar>
                    )}
                  </div>
                  <div className="d-flex flex-column">
                    <h5>
                      {(profile?.firstName ?? "") +
                        " " +
                        (profile?.lastName ?? "")}
                    </h5>
                    <p>{profile?.title ?? ""}</p>
                  </div>
                  <div>
                    {!profile?.isProfileCompleted && (
                      <RoundTag
                        toolTip={t("heading.profileNotCompleted")}
                        text={t("tag.draftProfile")}
                        icon={<IssuesCloseOutlined />}
                      />
                    )}
                  </div>
                </Flex>
                <Flex gap={12}>
                  <Button
                    onClick={onViewEngagements}
                    label={t("button.viewEngagements")}
                  />
                  <Button
                    onClick={onEditProfile}
                    label={t("button.editProfile")}
                  />
                </Flex>
              </Flex>
              <Flex gap={12}>
                <RoundTag
                  text={t("tag.hourRate", { rate: profile?.hourlyRate })}
                  icon={<DollarCircle />}
                />

                {!profile?.isCurrentlyHired && (
                  <RoundTag
                    text={t("tag.availableNow")}
                    icon={<Lightning />}
                    color="green"
                  />
                )}
              </Flex>
              {transparentCard({
                heading: t("heading.bio"),
                children: formatText(profile?.profileSummary ?? ""),
              })}
              {transparentCard({
                heading: t("heading.skills"),
                children: (
                  <span className="flex-wrap d-flex">{formmatedSkills()}</span>
                ),
              })}
              {transparentCard({
                heading: t("heading.experience"),

                children: (
                  <>
                    <span className="d-flex flex-column gap-4 w-100">
                      {Array.isArray(profile?.WorkExperience) &&
                        profile?.WorkExperience?.map((data: WorkExperience) => {
                          return (
                            <>
                              <div className={st.card_job_title_heading}>
                                {data?.jobTitle}
                              </div>
                              <div className="d-flex justify-content-between">
                                <div className={`${st.card_company_heading}`}>
                                  {data?.organization}
                                </div>
                                <div
                                  className={`${st.card_company_heading} text-right`}
                                >
                                  {formatToMonthYear(data?.startDate)} -{" "}
                                  {formatToMonthYear(data?.endDate) ??
                                    t("heading.current")}
                                </div>
                              </div>

                              <p className={st.card_desc}>
                                {formatText(data?.summary ?? "")}
                              </p>
                            </>
                          );
                        })}
                    </span>
                  </>
                ),
              })}
              {transparentCard({
                heading: t("heading.education"),
                children: (
                  <>
                    <span className="d-flex flex-column gap-4 w-100">
                      {Array.isArray(profile?.EducationHistory) &&
                        profile?.EducationHistory?.map(
                          (data: EducationHistory) => {
                            return (
                              <>
                                <div className={st.card_job_title_heading}>
                                  {data?.certification ?? "-"}
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div className={`${st.card_company_heading}`}>
                                    {data?.institute ?? "-"}
                                  </div>
                                  <div
                                    className={`${st.card_company_heading} text-right`}
                                  >
                                    {formatToMonthYear(data?.completionDate)}
                                  </div>
                                </div>
                              </>
                            );
                          }
                        )}
                    </span>
                  </>
                ),
              })}{" "}
            </>
          )}
        </Content>
      </Spin>
    </Content>
  );
};

export default ResourceProfile;
