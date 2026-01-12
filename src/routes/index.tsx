import * as React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "src/components/not-found";
import { ROUTES } from "src/constants/navigation-routes";
import { PrivateRoutes } from "src/constants/routes-types";
import { DashboardPage } from "src/pages";
import { getAuthenticationData } from "src/store/selectors/features/authentication";
import publicRouteConfig from "./public-route-config";

const Router: React.FC = () => {
  const isLoggedIn: any = useSelector(getAuthenticationData);

  const isVerified = () => {
    return isLoggedIn;
  };

  return (
    <BrowserRouter>
      <Routes>
        {isVerified() ? (
          <>
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route
              path="/*"
              element={<Navigate to={PrivateRoutes.DASHBOARD} />}
            />
          </>
        ) : (
          <React.Fragment>
            <Route path="*" element={<NotFound />} />
            <Route path="/*" element={<Navigate to={ROUTES.LOGIN} />} />
            {publicRouteConfig.map(({ path, component }: TObject) => (
              <Route key={path} path={`${path}`} element={component} />
            ))}
          </React.Fragment>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default React.memo(Router);
