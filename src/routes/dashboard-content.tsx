import { Flex } from "antd";
import { Content } from "antd/es/layout/layout";
import { PageHeader } from "nusoft_components";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "src/components/not-found";
import { ROUTES } from "src/constants/navigation-routes";
import { getAuthenticationData } from "src/store/selectors/features/authentication";
import { getCreateResourceValues } from "src/store/selectors/features/createResourceValues";
import { colors } from "src/styles/colors";
import dashboardRouteConfig from "./dashboard-route-config";

export function isArrayWithLength(arr: TArrayOfObjects) {
  return Array.isArray(arr) && arr.length;
}

const DashboardContent = () => {
  const user: any = useSelector(getAuthenticationData);
  const resource: any = useSelector(getCreateResourceValues);
  const location = useLocation();

  function getAllowedRoutes(routes: TObject[], role: string) {
    return routes
      .map((route) => {
        const { permission, children } = route;

        // Check if the route is allowed based on the role
        const isAllowed =
          !permission ||
          !Array.isArray(permission) ||
          permission.includes(role);

        // If the route has children, recursively check them
        const allowedChildren: any = children
          ? getAllowedRoutes(children, role)
          : [];

        // If the route or its children are allowed, include it
        if (isAllowed || allowedChildren.length > 0) {
          return {
            ...route,
            children: allowedChildren,
          };
        }

        return null; // Exclude this route if neither it nor its children are allowed
      })
      .filter(Boolean); // Remove null values
  }

  let allowedRoutes = [];
  allowedRoutes = getAllowedRoutes(dashboardRouteConfig, user?.role);

  const checkPath = (path: string, label: string) => {
    if (
      (path === ROUTES.CREATEADMINRESOURCE &&
        !resource?.isProfileCompleted &&
        resource?.id) ||
      (path === ROUTES.CREATERESOURCE &&
        !resource?.isProfileCompleted &&
        resource?.id)
    ) {
      return (
        <>
          <Flex className="d-flex gap-2">{`${label} `}</Flex>
        </>
      );
    }

    return label;
  };

  return (
    <div className="h-100 overflow-auto w-100">
      <Routes>
        <Route path="*" element={<NotFound />} />
        {allowedRoutes.map((route: TObject) => {
          const {
            path,
            component: Component,
            children,
            title,
            permission,
            label,
            subMenu,
            ...rest
          } = route;
          return (
            <Route key={`${path + 1}`} id={`${path + 1}`}>
              <Route
                id={path}
                key={path}
                path={`${path}`}
                {...rest}
                element={
                  <div className="hw-100 position-relative overflow-auto">
                    {location.pathname !== ROUTES.DASHBOARD && (
                      <Content
                        className="w-100 position-fixed bg-grey"
                        style={{
                          zIndex: 3,
                          background: colors.inputGreyBackground,
                        }}
                      >
                        <PageHeader heading={checkPath(path, label)} />
                      </Content>
                    )}

                    <div
                      className={`m-2 p-2 pt-1 ${
                        location.pathname !== ROUTES.DASHBOARD
                          ? " mt-5"
                          : "mt-0"
                      }`}
                    >
                      {Component}
                    </div>
                  </div>
                }
              />
              {children ? (
                children?.map((i: TObject) => {
                  const {
                    path,
                    component: Component,
                    children,
                    title,
                    permission,
                    label,
                    ...rest
                  } = i;
                  return (
                    <Route
                      id={path}
                      key={path}
                      path={`${path}`}
                      {...rest}
                      element={
                        <div className="hw-100 position-relative overflow-auto">
                          <Content
                            className="w-100 position-fixed  bg-grey"
                            style={{
                              zIndex: 3,
                              background: colors.inputGreyBackground,
                            }}
                          >
                            <PageHeader heading={checkPath(path, label)} />
                          </Content>
                          <div className="m-2 mt-5 p-2 pt-1">{Component}</div>
                        </div>
                      }
                    />
                  );
                })
              ) : (
                <></>
              )}
              {subMenu ? (
                subMenu?.map((i: TObject) => {
                  const {
                    path,
                    component: Component,
                    children,
                    title,
                    permission,
                    label,
                    ...rest
                  } = i;
                  return (
                    <Route
                      id={path}
                      key={path}
                      path={`${path}`}
                      {...rest}
                      element={
                        <div className="hw-100 position-relative overflow-auto">
                          <Content
                            className="w-100 position-fixed  bg-grey"
                            style={{
                              zIndex: 3,
                              background: colors.inputGreyBackground,
                            }}
                          >
                            <PageHeader heading={checkPath(path, label)} />
                          </Content>
                          <div className="m-2 mt-5 p-2 pt-1">{Component}</div>
                        </div>
                      }
                    />
                  );
                })
              ) : (
                <></>
              )}
            </Route>
          );
        })}
      </Routes>
    </div>
  );
};

export default DashboardContent;
