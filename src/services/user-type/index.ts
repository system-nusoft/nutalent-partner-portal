import { store } from "src/App";
import { ROLES } from "src/constants/roles";

const getUserData = () => {
  const user: any = store.getState().features.authentication?.apiStatus?.data;
  return user;
};

export const isPartner = () => {
  const { role } = getUserData();
  return ROLES.PARTNER === role;
};

export const isSuperAdmin = () => {
  const { role } = getUserData();
  return ROLES.SUPER_ADMIN === role;
};

export interface ModalInterfaceProps {
  openModal: () => void;
  closeModal: () => void;
}
