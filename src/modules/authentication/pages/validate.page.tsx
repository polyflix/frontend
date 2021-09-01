import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { fadeInDown, FilledButton, Paragraph, stagger } from "../../ui";
import { motion } from "framer-motion";
import { useInjection } from "@polyflix/di";
import { AuthService } from "../services";
import { useAuth } from "../hooks";
import { useParams } from "react-router-dom";

const ValidatePage: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService);
  const { user } = useAuth();
  const { t } = useTranslation();
  const { confirmUserAccountId: userId } =
    useParams<{ confirmUserAccountId: string }>();
  useEffect(() => {
    if (userId) {
      authService.activateAccount(userId);
    }
  }, [authService, userId]);
  return !userId ? (
    <Page
      title={t("auth.signUp.accountValidation.title")}
      className="flex items-center justify-center h-full"
    >
      <Container mxAuto>
        <motion.div
          variants={stagger(0.1)}
          className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
        >
          <Paragraph variants={fadeInDown} className="my-3">
            {t("auth.signUp.accountValidation.description.0")}. <br />
            {t("auth.signUp.accountValidation.description.1")}. <br />
            {t("auth.signUp.accountValidation.description.2")}.
          </Paragraph>
          <FilledButton
            variants={fadeInDown}
            as="button"
            className="col-span-2"
            onClick={() => authService.sendValidationEmail(user?.email || "")}
          >
            {t("auth.signUp.accountValidation.action")}
          </FilledButton>
        </motion.div>
      </Container>
    </Page>
  ) : (
    <Page
      title={t("auth.signUp.accountValidation.title")}
      className="flex items-center justify-center h-full"
    >
      <Container mxAuto>
        <motion.div
          variants={stagger(0.1)}
          className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
        >
          <Paragraph>
            {t("auth.signUp.accountValidation.error.0")}. <br />
            {t("auth.signUp.accountValidation.error.1")}.
          </Paragraph>
          <FilledButton
            variants={fadeInDown}
            as="button"
            className="col-span-2"
            onClick={() => authService.sendValidationEmail(user?.email || "")}
          >
            {t("auth.signUp.accountValidation.action")}
          </FilledButton>
        </motion.div>
      </Container>
    </Page>
  );
};

export default ValidatePage;
