import { Col, Row, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { Card, ChaiiText, LineChart } from "nusoft_components";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardDataLoading,
  getDashboardData,
} from "src/store/selectors/features/dashboard-data";
import { getCurrentUserData } from "src/store/selectors/features/get-user";
import RequestAppAction from "src/store/slices/app-actions";
import JohnDoe from "../../assets/images/johnDoeLogo.png";
import styles from "./styles.module.scss";

export const HomePagePartner: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useSelector(dashboardDataLoading);
  const dashboardData: any = useSelector(getDashboardData);
  const user: any = useSelector(getCurrentUserData);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels: months,
    datasets: [
      {
        data: dashboardData?.totalResourcesHiredBySkills?.map(
          ({ month, total, countByDomain }: any) => ({
            x: month,
            y: total,
            countByDomain: countByDomain,
          })
        ),

        fill: 1,
        backgroundColor: "rgba(0, 73, 252, 0.2)",
        borderColor: "rgba(0,73, 252, 1)",
      },
    ],
  };
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (user)
      dispatch(RequestAppAction.handleGetDashoard({ id: user?.partnerId }));
  }, [user]);

  const cards = [
    {
      name: t("heading.totalResources"),
      des: t("text.allTime"),
      value: dashboardData?.totalResources,
    },
    {
      name: t("heading.totalHired"),
      des: t("text.currently"),
      value: 0,
    },
    {
      name: t("heading.totalActiveEngagements"),
      des: t("text.currently"),
      value: dashboardData?.totalActiveEngagements,
    },
    {
      name: t("heading.totalCompletedEngagements"),
      des: t("text.allTime"),
      value: dashboardData?.totalCompletedEngagements,
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <Content className="w-100 d-flex gap-3 flex-column h-100">
        <Row gutter={[0, 16]} className="w-100 h-100">
          <Col
            className="w-100 h-100 p-4 bg-light rounded-1 d-flex gap-2 flex-column"
            span={24}
          >
            <Row gutter={16}>
              <Col>
                <img className={styles.img_styles} src={JohnDoe} />
              </Col>
              <Col>
                <ChaiiText className={styles.line_chart_heading}>
                  {t("placeholder.partnerName")}
                </ChaiiText>
              </Col>
            </Row>
            <LineChart height={28} width={100} data={data} />
          </Col>
        </Row>
        <Row gutter={20}>
          {cards.map(({ des, name, value }, index) => {
            return (
              <Col key={index} span={6}>
                <Card heading={name} desc={des}>
                  <Content className="mt-4">
                    <ChaiiText className={`${styles.card_number}`}>
                      {value}
                    </ChaiiText>
                  </Content>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Content>
    </Spin>
  );
};
