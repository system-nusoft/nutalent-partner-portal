import { Col, Flex, Layout, Row, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { Logo } from "src/assets/svg";
import "./index.scss";

const { Text } = Typography;

interface props {
  children: React.ReactNode;
}

const AuthScreenTemplate = ({ children }: props) => {
  const { t } = useTranslation();
  return (
    <Flex className="position-relative hw-100" gap="middle" wrap>
      <Layout className="hw-100">
        <Content className="flex-center hw-100">
          <Row className="hw-100">
            <Col
              className="main justify-start d-flex align-items-center"
              span={12}
            >
              <div className="min-content logo-div ms-10">
                <Logo />
                <Text className="slogan pt-2 text-left d-flex">
                  {t("auth.slogan")}
                </Text>
              </div>
            </Col>
            <Col className="bg-white flex-center" span={12}>
              {children}
            </Col>
          </Row>
        </Content>
      </Layout>
      <Flex className="position-absolute min-content bottom-right-position">
        <Text className="copyright-text-style-black">
          {t("heading.copyright")}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AuthScreenTemplate;
