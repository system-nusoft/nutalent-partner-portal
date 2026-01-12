import { Flex, Typography } from "antd";
import CostAndAvailibilty from "../cost-and-availablity";
import ResourceMainDetail from "../resource-main-details";
import ResourceMainEducation from "../resource-main-education";
import ResourceMainExperiance from "../resource-main-experiance";
import ResourceMainSkills from "../resource-main-skills";
import styles from "./admin-resource-profile-details.module.scss";

const { Text } = Typography;

interface props {}
const AdminResourceProfileDetails = ({}: props) => {
  return (
    <Flex
      className={`${styles.resource_profile_details_div} flex-center gap-3 d-flex flex-column align-items-start`}
    >
      <ResourceMainDetail onSuccess={() => {}} />
      <ResourceMainExperiance onSuccess={() => {}} />
      <ResourceMainSkills onSuccess={() => {}} />
      <ResourceMainEducation onSuccess={() => {}} />
      <CostAndAvailibilty onSuccess={() => {}} />
    </Flex>
  );
};

export default AdminResourceProfileDetails;
