import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import { LinkRouter } from "../LinkRouter/link-router.component";

{
  /* TODO i18n */
}
export const RouterBreadcrumbs: React.FC<{}> = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const displayValue = to.split("/").pop();
        return last ? (
          <Typography color="text.primary" key={to}>
            {displayValue}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={to} key={to}>
            {displayValue}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};
