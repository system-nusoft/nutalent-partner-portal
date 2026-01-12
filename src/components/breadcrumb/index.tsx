import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import styles from "./breadcrumb-styles.module.scss";

const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  // Extract the query parameters from the location search
  const searchParams = location.search;

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}${searchParams}`;

    const breadcrumbText = snippet
      .replace(/-/g, " ")
      .replace(
        /^(\w)(\w*)/,
        (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
      );
    return (
      <Breadcrumb.Item className="min-content" key={url}>
        <Link
          className={
            index === pathSnippets.length - 1
              ? styles.dark_text
              : styles.light_text
          }
          to={url}
        >
          {breadcrumbText?.replace(/%20/g, " ").slice(-13)}
        </Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <Breadcrumb className={styles.breadcrumbs_wrapper}>
      <Breadcrumb.Item></Breadcrumb.Item>
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default AppBreadcrumbs;
