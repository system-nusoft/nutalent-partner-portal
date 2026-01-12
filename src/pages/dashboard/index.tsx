import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Modal, Typography } from "antd";
import { AppHeader } from "nusoft_components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LogoWhite } from "src/assets/svg";
import AppBreadcrumbs from "src/components/breadcrumb";
import { ROUTES } from "src/constants/navigation-routes";
import { ROLES } from "src/constants/roles";
import DashboardContent from "src/routes/dashboard-content";
import dashboardRouteConfig from "src/routes/dashboard-route-config";
import { LocalStorageService } from "src/services/local-storage";
import { isPartner } from "src/services/user-type";
import { getAuthenticationData } from "src/store/selectors/features/authentication";
import { getPartnerData } from "src/store/selectors/features/get-partner";
import { getInquiresList } from "src/store/selectors/features/inquiries-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleGreeting } from "src/store/slices/features/app";
import { toggleClearLogin } from "src/store/slices/features/authReducer";
import { toggleNewMessage } from "src/store/slices/features/messages-reducer";
import { toggleAddSocketData } from "src/store/slices/features/socket-resume-valuse";
import { colors } from "src/styles/colors";
import { getRandomGreeting } from "src/utils/functions";
import styles from "./dashboard-styles.module.scss";

const { Content, Sider } = Layout;
const { Title } = Typography;

let token: any = null;
let currentPathName: any = null;

export const DashboardPage: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string[]>(["0"]);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const user: any = useSelector(getAuthenticationData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUser: any = useSelector(getAuthenticationData);
  const partner: any = useSelector(getPartnerData);
  const inquires = useSelector(getInquiresList);

  const items: MenuProps["items"] = dashboardRouteConfig
    .filter(
      ({ permission, label }) =>
        permission.includes(user?.role) && label !== "Account"
    )
    .map(({ icon, title, path }, index) => {
      const pathname = location.pathname;
      const parts = pathname.split("/");
      const modifiedPath = parts.length > 1 ? `${parts[2]}` : "";

      return {
        key: `${index}`,
        icon: icon ? (
          icon({
            fill:
              modifiedPath === path ||
              location.pathname.replace("/dashboard", "") === path
                ? colors.primary
                : colors.textColor,
          })
        ) : (
          <></>
        ),
        label: (
          <span className="d-flex align-items-center gap-2 ms-1">
            {title}
            {title === "Inquiries" &&
            Array.isArray(inquires) &&
            inquires?.some(({ unreadCount }) => unreadCount > 0) ? (
              <span className={styles.notification_dot} />
            ) : (
              <></>
            )}
          </span>
        ),
        onClick: (e) => {
          setSelectedPath([e.key]);
          navigate(path);
        },
        style: {
          height: "min-content",
          background: colors.white,
          color:
            modifiedPath === path ||
            location.pathname.replace("/dashboard", "") === path
              ? colors.primary
              : colors.textColor,
          fontFamily: "Inter",
          fontSize: "0.87rem",
          fontWeight: 400,
        },
      };
    });

  const SelectedItem = () => {
    dashboardRouteConfig.map((_, index: number) => {
      setSelectedPath([`${index}`]);
    });
  };

  useEffect(() => {
    SelectedItem();
  }, [location.pathname]);

  const endItemsRoutes = [
    {
      name: t("heading.account"),
      icon: () => <SettingFilled className={`ms-1 me-1 ${styles.icon}`} />,
      path: ROUTES.SETTINGS,
    },
    {
      name: t("heading.logout"),
      icon: () => <LogoutOutlined className={`ms-1 me-1 ${styles.icon}`} />,
      path: t("heading.logout"),
    },
  ];

  const handleLogout = () => {
    Modal.confirm({
      title: t("heading.logout"),
      content: t("heading.logoutContent"),
      icon: null,
      okType: "danger",
      okButtonProps: {
        style: { backgroundColor: colors.red, color: colors.darkRed },
      },
      onOk() {
        dispatch(
          RequestAppAction.handleSignout({
            cbSuccess: () => navigate(ROUTES.LOGIN),
          })
        );
      },
    });
  };

  const itemsEnd: MenuProps["items"] = endItemsRoutes.map(
    ({ icon, name, path }, index) => {
      const currentPath = location.pathname;
      const modifiedPath = location.pathname.replace("/dashboard/", "");
      return {
        key: `${index}`,
        icon: icon(),
        label: name,
        onClick: (e) => {
          if (path === t("heading.logout")) {
            handleLogout();
          } else {
            setSelectedPath([e.key]);
            navigate(path);
          }
        },
        style: {
          color: modifiedPath === path ? colors.primary : colors.textColor,
          fontSize: "0.8rem",
          fontWeight: 500,
          fontFamily: "Poppins",
          lineHeight: "3rem",
          background: currentPath === path ? colors.primary : colors.white,
        },
      };
    }
  );

  const getPartnerDetails = () => {
    dispatch(
      RequestAppAction.handleGetUser({
        cbSuccess: (res) => {
          if (isPartner())
            dispatch(
              RequestAppAction.handleGetPartner({
                id: res?.partnerId,
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
    if (user?.role !== ROLES.END_USER) {
      getSkills();
      getPartnerDetails();
    }
  }, []);

  useEffect(() => {
    dispatch(
      RequestAppAction.handleGetInquires({ query: { page: 1, limit: 10 } })
    );
  }, []);

  token = loggedInUser?.jwtToken;
  const localStorage = new LocalStorageService();
  currentPathName = location.pathname;

  useEffect(() => {
    if (token) {
      const socket = io(`${process.env.REACT_APP_SOCKET_URL}events`, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
        query: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket.on("newMessage", (res) => {
        if (currentPathName !== ROUTES.INQUIRES) {
          dispatch(
            RequestAppAction.handleGetInquires({
              query: { page: 1, limit: 10 },
            })
          );
        }
        dispatch(toggleNewMessage(res));
      });
      socket.on("newResource", (res) => {
        dispatch(toggleAddSocketData(res));
      });

      socket.on("error", (res) => {
        if (res?.statusCode === 401) {
          dispatch(toggleClearLogin());
          localStorage.remove("user");
          navigate(ROUTES.LOGIN);
        }
      });

      return () => {
        socket.off();
      };
    }
  }, []);

  useEffect(() => {
    dispatch(toggleGreeting(getRandomGreeting()));
  }, []);

  return (
    <Layout className="hw-100">
      <AppHeader
        isAuthenticated={user ? true : false}
        logo={<LogoWhite />}
        avatarImage={partner?.companyLogo}
        userName={user?.name ?? ""}
        isAdmin={user?.partnerId ? false : true}
      />
      <Layout>
        <Sider
          trigger={
            <Title
              level={5}
              style={{ padding: 0, margin: 0, marginLeft: "0.5rem" }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Title>
          }
          collapsible
          collapsed={collapsed}
          theme="light"
          onCollapse={(value) => setCollapsed(value)}
          width={"10.5rem"}
          className={styles.custom_sider}
        >
          <div className={styles.sider_content}>
            <Menu
              mode="inline"
              className="h-100"
              selectable
              selectedKeys={selectedPath}
              items={items}
            />
            <Menu
              mode="inline"
              selectable
              selectedKeys={selectedPath}
              items={itemsEnd}
              className={styles.items_end}
            />
          </div>
        </Sider>
        <Layout>
          {location.pathname !== ROUTES.DASHBOARD && <AppBreadcrumbs />}

          <Content className="overflow-initial hw-100">
            <div className="overflow-auto hw-100">
              <DashboardContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
