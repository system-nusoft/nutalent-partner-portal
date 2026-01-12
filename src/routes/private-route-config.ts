import { DashboardPage } from "../pages";

// TODO:
/*
 * 1. Make title optional
 * 2. Make title multi type support ie: (string, node, react element)
 * 3. Add child route support
 * */

export default [
  {
    component: DashboardPage,
    path: "/dashboard/*",
    title: "Dashboard",
  },
];
