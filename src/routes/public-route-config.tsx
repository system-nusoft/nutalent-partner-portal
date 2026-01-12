import { ForgotPasswordPage } from "src/pages/auth/forgot-password";
import { SignUpPage } from "src/pages/auth/registration";
import { ResetPasswordPage } from "src/pages/auth/reset-password";
import { LinkExpired } from "src/pages/link-expired";
import { ProfileSetup } from "src/pages/profile-setup";
import { SplashScreen } from "src/pages/splash-screen";
import { LoginPage } from "../pages/auth/login";

// TODO:
/*
 * 1. Make title optional
 * 2. Make title multi type support ie: (string, node, react element)
 * 3. Add child route support
 * */

export default [
  {
    component: <LoginPage />,
    path: "/",
    title: "Login",
  },
  {
    component: <LoginPage />,
    path: "/login",
    title: "Login",
  },
  {
    component: <SignUpPage />,
    path: "/sign-up",
    title: "SignUp",
  },
  {
    component: <LinkExpired />,
    path: "/link-expired",
    title: "Link Expired",
  },
  {
    component: <SplashScreen />,
    path: "/splash-screen",
    title: "Splash Screen",
  },
  {
    component: <ProfileSetup />,
    path: "/account-setup",
    title: "Profile Setup",
    label: "Profile Setup",
  },
  {
    component: <ForgotPasswordPage />,
    path: "/forgot-password",
    title: "Forgot Password",
    label: "Forgot Password",
  },
  {
    component: <ResetPasswordPage />,
    path: "/reset-password",
    title: "Reset Password",
    label: "Reset Password",
  },
];
