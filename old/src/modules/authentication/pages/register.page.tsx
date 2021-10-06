import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { RegisterForm } from "../components/RegisterForm/RegisterForm.component";
import CookieConsent from "react-cookie-consent";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("auth.signUp.seo.title")} className="items-center">
      <Container mxAuto>
        <RegisterForm />

        <CookieConsent
          disableStyles={true}
          location="bottom"
          buttonText={t("auth.cookies.consent")}
          cookieName="consent-cookie"
          overlayClasses="fixed top-0	left-0 w-full "
          buttonClasses="p-1.5 m-0.5 transition-colors bg-nx-white border-2  hover:bg-nx-red-dark border-nx-red hover:border-nx-red-dark cursor-pointer"
          containerClasses="pl-1 p-0.5 bg-nx-red transition-colors text-black flex-initial items-baseline	flex-wrap flex left-0 fixed w-full justify-between"
          expires={150} // in days
        >
          {t("auth.cookies.explanation")}
        </CookieConsent>
      </Container>
    </Page>
  );
};

export default RegisterPage;
