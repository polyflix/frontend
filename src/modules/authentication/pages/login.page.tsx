import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { LoginForm } from "../components/LoginForm/LoginForm.component";
import CookieConsent from "react-cookie-consent";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("auth.signIn.seo.title")} className="items-center">
      <Container mxAuto>
        <LoginForm />
      </Container>
      <CookieConsent
        disableStyles={true}
        location="bottom"
        buttonText={t("auth.cookies.consent")}
        cookieName="consent-cookie"
        overlayClasses="fixed top-0	left-0 w-full "
        buttonClasses="p-1.5 m-0.5 bg-nx-white border-2  hover:bg-nx-red-dark border-nx-red hover:border-nx-red-dark cursor-pointer"
        containerClasses="pl-1 p-0.5 bg-nx-red transition-colors text-black flex-initial items-baseline	flex-wrap flex left-0 fixed w-full justify-between"
        expires={150} // in days
      >
        {t("auth.cookies.explanation")}
      </CookieConsent>
    </Page>
  );
};

export default LoginPage;
