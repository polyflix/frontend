import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Token, useAuth } from "../../../authentication";
import { useInjection } from "@polyflix/di";
import {
  Alert,
  AlertType,
  fadeInDown,
  FilledButton,
  Input,
  Spinner,
  stagger,
  Title,
  Typography,
} from "../../../ui";
import { UserService } from "../../services";
import { IUserProfileUpdate } from "../../types";

/**
 * The profile form component
 */
export const ProfileForm: React.FC = () => {
  const userService = useInjection<UserService>(UserService);
  const { token, user, isLoading } = useAuth();
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const { register, handleSubmit, errors } = useForm<IUserProfileUpdate>({
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });
  const { t } = useTranslation();

  const handleUpdate = async (data: IUserProfileUpdate) => {
    setAlert(null);
    try {
      await userService.updateUser(token as Token, user?.id as string, data);
      setAlert({
        message: t("userProfile.messages.successProfile"),
        type: "success",
      });
    } catch (e) {
      setAlert({
        message: e,
        type: "error",
      });
    }
  };

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 lg:w-9/12 mx-auto"
    >
      <Title variants={fadeInDown}>{t("userProfile.bigtitle")}</Title>
      <form
        className="mt-4 grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <Input
          error={errors.firstName}
          name="firstName"
          className="col-span-1"
          placeholder={t("auth.signUp.inputs.firstname.name")}
          required
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t("auth.signUp.inputs.firstname.error")}.`,
            },
          })}
        />
        <Input
          error={errors.lastName}
          name="lastName"
          required
          className="col-span-1"
          placeholder={t("auth.signUp.inputs.lastname.name")}
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t("auth.signUp.inputs.lastname.error")}.`,
            },
          })}
        />
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
          inputValue={t("userProfile.form.submit")}
          variants={fadeInDown}
        />
      </form>
    </motion.div>
  );
};
