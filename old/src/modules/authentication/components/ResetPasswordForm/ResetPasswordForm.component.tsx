import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useInjection } from "@polyflix/di";
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
import { IResetPasswordForm, IResetRequestForm } from "../../types/auth.type";
import { useQuery } from "../../../common/hooks/useQuery";
import { useHistory } from "react-router-dom";

/**
 * The reset password form component
 */
export const ResetPasswordForm: React.FC = () => {
  const queries = useQuery();
  const resetToken: string | null = (queries as URLSearchParams).get("token");
  const resetEmail: string | null = (queries as URLSearchParams).get("email");
  const history = useHistory();

  const authService = useInjection<AuthService>(AuthService);
  const handleReset = async (data: IResetPasswordForm) => {
    if (resetToken && resetEmail) {
      data.email = resetEmail;
      data.token = resetToken;
      if (await authService.resetPassword(data)) {
        history.push("/auth/login");
      }
    }
  };
  const handleEmail = async (data: IResetRequestForm) => {
    await authService.sendResetEmail(data);
    history.push("/auth/login");
  };
  const { authError, isLoading } = useAuth();
  const { register, handleSubmit, errors, watch } =
    useForm<IResetPasswordForm>();
  const {
    register: resetPasswordEmail,
    handleSubmit: handleEmailSubmit,
    errors: errorsEmail,
  } = useForm<IResetRequestForm>();
  const { t } = useTranslation();

  if (resetToken && resetEmail) {
    return (
      <motion.div
        variants={stagger(0.1)}
        className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
      >
        <Title variants={fadeInDown}>{t("auth.resetPassword.seo.title")}</Title>
        <Paragraph variants={fadeInDown} className="my-3">
          {t("auth.resetPassword.seo.description.2")}.
        </Paragraph>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(handleReset)}
        >
          <Input
            error={errors.newPassword}
            name="newPassword"
            type="password"
            className="col-span-2"
            required
            variants={fadeInDown}
            placeholder={t("auth.inputs.password.name")}
            hint={t("auth.inputs.password.description")}
            ref={register({
              minLength: {
                value: 8,
                message: `${t("auth.inputs.password.description")}.`,
              },
              required: {
                value: true,
                message: `${t("auth.inputs.password.error")}.`,
              },
            })}
          />
          <Input
            error={errors.passwordConfirm}
            name="passwordConfirm"
            type="password"
            required
            className="col-span-2"
            variants={fadeInDown}
            placeholder={t("auth.signUp.inputs.passwordConfirm.name")}
            ref={register({
              validate: (value) =>
                value === watch("newPassword") ||
                `${t("auth.signUp.inputs.passwordConfirm.error")}.`,
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
          {authError && (
            <Alert type="error">{t("auth.resetPassword.error")}</Alert>
          )}
          <FilledButton
            variants={fadeInDown}
            disabled={isLoading}
            as="input"
            className="col-span-2"
            inputValue={t("auth.resetPassword.action")}
          />
        </form>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        variants={stagger(0.1)}
        className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
      >
        <Title variants={fadeInDown}>{t("auth.resetPassword.seo.title")}</Title>
        <Paragraph variants={fadeInDown} className="my-3">
          {t("auth.resetPassword.seo.description.0")}. <br />
          {t("auth.resetPassword.seo.description.1")}.
        </Paragraph>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleEmailSubmit(handleEmail)}
        >
          <Input
            name="email"
            error={errorsEmail.email}
            className="col-span-2"
            placeholder={t("auth.inputs.email.name")}
            required
            variants={fadeInDown}
            ref={resetPasswordEmail({
              required: {
                value: true,
                message: `${t("auth.inputs.email.error")}.`,
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
          <FilledButton
            variants={fadeInDown}
            disabled={isLoading}
            as="input"
            className="col-span-2"
            inputValue={t("auth.resetPassword.action")}
          />
        </form>
      </motion.div>
    );
  }
};
