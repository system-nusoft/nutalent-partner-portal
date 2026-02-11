import { ConfigProvider } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ErrorScreen } from "./components/error-screen";
import i18n from "./i18n";
import { reportWebVitals } from "./reportWebVitals";
import Router from "./routes";
import reduxStore from "./store";
import { colors } from "./styles/colors";
import { MobileFallback } from "./components/mobile-fallback";
export const { store, persistor } = reduxStore();

const MOBILE_BREAKPOINT = 1024; 

export const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  if (isMobile) return <MobileFallback />;

  return (
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorScreen}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <Suspense fallback="loading">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: colors.primary,
                  },

                  components: {
                    Table: {
                      headerColor: colors.textColor,
                      rowSelectedBg: colors.white,
                      rowSelectedHoverBg: colors.hover,
                    },
                    Radio: {
                      buttonCheckedBg: colors.primary,
                      buttonSolidCheckedActiveBg: colors.primary,
                    },
                  },
                }}
              >
                <Router />
              </ConfigProvider>
            </Suspense>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
  );
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
