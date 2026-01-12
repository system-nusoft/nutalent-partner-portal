import { Row } from "antd";
import { Content } from "antd/es/layout/layout";
import PartnerProfileDetails from "src/components/partner-profile-details";
import styles from "./editPartner.module.scss";

const EditPartner: React.FC = () => {
  return (
    <Row className={`${styles.add_new_resource_style} p-2 d-flex flex-column"`}>
      <Content
        className={`pt-4 flex-center rounded-1 ${styles.add_new_resource_container} d-flex flex-column align-items-center`}
      >
        <PartnerProfileDetails />
      </Content>
    </Row>
  );
};

export default EditPartner;
