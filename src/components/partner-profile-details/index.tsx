import { Flex } from "antd";
import PartnerEmailDetails from "../partner-email-details";
import styles from "./partner-profile-details.module.scss";

interface props {}
const PartnerProfileDetails = ({}: props) => {
  return (
    <Flex
      className={`${styles.resource_profile_details_div} w-100  flex-center gap-3 d-flex flex-column align-items-center`}
    >
      <PartnerEmailDetails />
    </Flex>
  );
};

export default PartnerProfileDetails;
