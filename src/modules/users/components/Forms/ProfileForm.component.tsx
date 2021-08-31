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
  Image as Img,
  Input,
  Spinner,
  stagger,
  Title,
  Typography,
} from "../../../ui";
import { UserService } from "../../services";
import { IUserProfileUpdate } from "../../types";
import { ImageFile } from "../../../upload/models/files/image.model";
import { MinioFile } from "../../../upload/models/files/minio-file.model";
import { MinioService } from "../../../upload/services/minio.service";
import { UploadButton } from "../../../ui/components/Buttons/UploadButton/UploadButton.component";
import { TrashIcon } from "@heroicons/react/solid";

/**
 * The profile form component
 */
export const ProfileForm: React.FC = () => {
  const userService = useInjection<UserService>(UserService);
  const minioService = useInjection<MinioService>(MinioService);

  const { user, isLoading } = useAuth();
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
      profilePicture: user?.profilePicture,
    },
  });
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<ImageFile>();
  const [deleteImage, setDeleteImage] = useState<boolean>(false);
  const handleUpdate = async (data: IUserProfileUpdate) => {
    setAlert(null);
    try {
      data = await uploadFiles(data);
      await userService.updateUser(user?.id!, data);
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

  const getFile = (files: MinioFile[], field: keyof IUserProfileUpdate) => {
    return files.find((file) => file.getField() === field);
  };

  const uploadFiles = async (data: IUserProfileUpdate) => {
    if (deleteImage) {
      return { ...data, profilePicture: null };
    }
    const uploadedFiles = await minioService.upload([imageFile as MinioFile]);
    const attributes: (keyof IUserProfileUpdate)[] = ["profilePicture"];
    attributes.forEach((attr) => {
      const url = getFile(uploadedFiles, attr)?.getFileURL();
      if (url) data = { ...data, [attr]: url };
    });
    return data;
  };

  const profilePicturePreview = () => {
    let file = imageFile as ImageFile;
    if (
      (!file && !user?.profilePicture) ||
      (user?.profilePicture && !file && deleteImage)
    ) {
      return "https://i.imgur.com/tdi3NGa.png";
    }
    if (!file && user?.profilePicture) {
      return user?.profilePicture;
    }

    return file.getPreview();
  };

  return (
    <motion.div variants={stagger(0.1)} className="py-5 w-full">
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <div className="col-span-2 md:col-span-1">
          <Title variants={fadeInDown}>{t("userProfile.bigtitle")}</Title>
        </div>
        <Img
          variants={fadeInDown}
          src={profilePicturePreview()}
          className="w-60 col-span-2 md:col-span-1 rounded-md"
          alt={`profilePicture`}
        />
      </div>

      <form
        className="mt-4 grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <div></div>
        <div className="grid grid-cols-2">
          <UploadButton<ImageFile>
            uploadClass={ImageFile}
            onFileUpload={(file) => {
              setDeleteImage(false);
              setImageFile(file);
            }}
            variants={fadeInDown}
            className="col-span-1 w-60"
            placeholder={t("auth.signUp.inputs.profilePicture")}
            format="image/*"
            name="profilePicture"
          />
          {!(
            (!imageFile && !user?.profilePicture) ||
            (user?.profilePicture && !imageFile && deleteImage)
          ) && (
            <>
              <button
                className="text-nx-red-dark hover:text-nx-red pl-2 w-full ml-5 mt-3 flex items-start gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  setImageFile(undefined);
                  setDeleteImage(true);
                }}
              >
                <TrashIcon className="h-10 w-10" />
              </button>
            </>
          )}
        </div>

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
