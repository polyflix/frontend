import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useInjection } from "../../../di";
import { fadeInDown } from "../../../ui/animations/fadeInDown";
import { stagger } from "../../../ui/animations/stagger";
import { Alert } from "../../../ui/components/Alert/Alert.component";
import { FilledButton } from "../../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Input } from "../../../ui/components/Input/Input.component";
import { Spinner } from "../../../ui/components/Spinner/Spinner.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Title } from "../../../ui/components/Typography/Title/Title.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { useAuth } from "../../hooks/useAuth.hook";
import { AuthService } from "../../services/auth.service";
import { ILoginForm } from "../../types/auth.type";

/**
 * The login form component
 */
export const LoginForm: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService);
  const { authError, isLoading } = useAuth();
  const { register, handleSubmit, errors } = useForm<ILoginForm>();
  const { t } = useTranslation();

  const handleLogin = (data: ILoginForm) => authService.login(data);

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
    >
      <Title variants={fadeInDown}>{t("auth.signIn.seo.title")}</Title>
      <Paragraph variants={fadeInDown} className="my-3">
        {t("auth.signIn.seo.description")}.
      </Paragraph>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Input
          name="email"
          error={errors.email}
          className="col-span-2"
          placeholder={t("auth.inputs.email.name")}
          required
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t("auth.inputs.email.error")}.`,
            },
          })}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          required
          className="col-span-2"
          variants={fadeInDown}
          placeholder={t("auth.inputs.password.name")}
          ref={register({
            required: {
              value: true,
              message: `${t("auth.inputs.password.error")}.`,
            },
          })}
        />
        {isLoading && (
          <div className="flex items-center">
            <Spinner className="fill-current text-nx-dark"></Spinner>
            <Typography as="span" className="text-sm ml-2">
              {t("shared.common.wait")}..
            </Typography>
          </div>
        )}
        {authError && <Alert type="error">{t("auth.signIn.error")}</Alert>}
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={t("auth.signIn.action")}
          variants={fadeInDown}
        />
      </form>
      <Paragraph variants={fadeInDown} className="mt-2">
        {t("auth.signIn.footer.0")}{" "}
        <Link to="/auth/register">
          <Typography as="span" bold>
            {t("auth.signIn.footer.1")}.
          </Typography>
        </Link>
      </Paragraph>
    </motion.div>
  );
};
