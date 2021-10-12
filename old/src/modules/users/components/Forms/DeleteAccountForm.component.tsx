import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../authentication";
import {
  Alert,
  AlertType,
  fadeInDown,
  FilledButton,
  Input,
  Paragraph,
  Spinner,
  stagger,
  Title,
  Typography,
} from "../../../ui";
import { UserService } from "../../services";

/**
 * The delete account form component
 */
export const DeleteAcountForm: React.FC = () => {
  const userService = useInjection<UserService>(UserService);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const { register, handleSubmit, errors, reset } =
    useForm<{
      email: string;
    }>();
  const { t } = useTranslation();

  const handleDelete = async () => {
    setAlert(null);
    try {
      setIsLoading(true);
      reset();
      await userService.deleteUser(user?.id!);
    } catch (e) {
      setAlert({
        message: `${t("userProfile.form.badPassword")} (${e})`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={stagger(0.1)} className="py-5 w-full">
      <Title variants={fadeInDown}>{t("userProfile.deleteAccountTitle")}</Title>
      <Paragraph className="mt-4">{`${t(
        "userProfile.deleteAccountForm.hint"
      )}.`}</Paragraph>
      <Paragraph className="italic">{`${t(
        "userProfile.deleteAccountForm.warning"
      )}.`}</Paragraph>
      <form
        className="mt-4 grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleDelete)}
      >
        <Input
          error={errors.email}
          name="email"
          type="email"
          className="col-span-2"
          variants={fadeInDown}
          required
          placeholder={t("userProfile.form.email.name")}
          ref={register({
            validate: (value) =>
              value === user?.email ||
              `${t("userProfile.deleteAccountForm.wrongEmail")}.`,
            required: {
              value: true,
              message: `${t("userProfile.deleteAccountForm.wrongEmail")}.`,
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
        {alert && (
          <Alert type={alert.type} className="col-span-2">
            {alert.message}
          </Alert>
        )}
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={t("userProfile.deleteAccountForm.submit")}
          variants={fadeInDown}
          onClick={() => setAlert(null)}
        />
      </form>
    </motion.div>
  );
};