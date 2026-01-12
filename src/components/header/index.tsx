import { Header } from "antd/es/layout/layout";
import { LogoBlack } from "src/assets/svg";

export const AppHeader = () => {
  return (
    <Header className="d-flex align-items-center justify-start ps-2 bg-white">
      <LogoBlack />
    </Header>
  );
};
