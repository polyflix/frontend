import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import slugify from "slugify";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import { Token } from "../../../authentication/models/token.model";
import { fadeInDown } from "../../../ui/animations/fadeInDown";
import { stagger } from "../../../ui/animations/stagger";
import { Alert, AlertType } from "../../../ui/components/Alert/Alert.component";
import { FilledButton } from "../../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Checkbox } from "../../../ui/components/Checkbox/Checkbox.component";
import { Image } from "../../../ui/components/Image/Image.component";
import { Input } from "../../../ui/components/Input/Input.component";
import { Spinner } from "../../../ui/components/Spinner/Spinner.component";
import { Textarea } from "../../../ui/components/Textarea/Textarea.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Title } from "../../../ui/components/Typography/Title/Title.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoService } from "../../services/video.service";
import { IVideoForm } from "../../types/videos.type";

type Props = {
  /** If video exists, the form will be in update mode, otherwise in create mode. */
  video?: Video | null;
};

/**
 * The video form component
 */
export const VideoForm: React.FC<Props> = ({ video }) => {
  const videoService = useInjection<VideoService>(VideoService);
  const { t } = useTranslation();
  const { token } = useAuth();
  const { register, handleSubmit, errors, watch } = useForm<IVideoForm>({
    defaultValues: {
      title: video?.title,
      description: video?.description,
      thumbnail: video?.thumbnail,
      isPublished: video?.isPublished || false,
      isPublic: video?.isPublic || false,
      src: video?.src,
      previewUrl: video?.previewUrl,
    },
  });
  const watchTitle = watch<"title", string>("title", "");
  const watchPrivacy = watch<"isPublic", boolean>("isPublic");
  const watchPublished = watch<"isPublished", boolean>("isPublished");
  const watchThumbnail = watch<"thumbnail", string>("thumbnail", "");

  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const isUpdate = video instanceof Video;

  const onSubmit = async (data: IVideoForm) => {
    setLoading(true);
    try {
      await (isUpdate
        ? videoService.updateVideo(video?.id as string, data, token as Token)
        : videoService.createVideo(data, token as Token));
      setAlert({
        message: isUpdate
          ? `"${data.title}" ${t("videoManagement.updateVideo.success")}.`
          : `"${data.title}" ${t("videoManagement.addVideo.success")}.`,
        type: "success",
      });
    } catch (err) {
      setAlert({
        message: `${t("videoManagement.addVideo.error")} "${data.title}"`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 mx-auto"
    >
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <div className="col-span-2 md:col-span-1">
          <Title variants={fadeInDown}>
            {isUpdate
              ? `${video?.title}`
              : `${t("shared.common.actions.add")}
							${t("videoManagement.video")}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t("videoManagement.updateVideo.description")}`
              : `${t("videoManagement.addVideo.description")}`}
            .
          </Paragraph>
        </div>
        <Image
          variants={fadeInDown}
          src={
            watchThumbnail === ""
              ? "https://i.stack.imgur.com/y9DpT.jpg"
              : watchThumbnail
          }
          className="w-full col-span-2 md:col-span-1 rounded-md"
          alt={`${watchTitle} thumbnail`}
        />
      </div>
      <form
        className="grid items-center grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="title"
          error={errors.title}
          className="col-span-2 md:col-span-1"
          placeholder={t("videoManagement.inputs.title.name")}
          required
          variants={fadeInDown}
          hint={
            watchTitle
              ? `UID : ${slugify(watchTitle, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                })}`
              : `${t("videoManagement.inputs.title.description")}.`
          }
          ref={register({
            required: {
              value: true,
              message: `${t("videoManagement.inputs.title.error")}.`,
            },
          })}
        />
        <Input
          error={errors.thumbnail}
          name="thumbnail"
          required
          className="col-span-2 md:col-span-1"
          variants={fadeInDown}
          placeholder={t("videoManagement.inputs.thumbnail.name")}
          hint={`${t("videoManagement.inputs.thumbnail.name")}.`}
          ref={register({
            required: {
              value: true,
              message: `${t("videoManagement.inputs.thumbnail.error")}.`,
            },
          })}
        />
        <Input
          error={errors.thumbnail}
          name="src"
          required
          className="col-span-2 md:col-span-1"
          variants={fadeInDown}
          placeholder={t("videoManagement.inputs.videoURL.name")}
          hint={`${t("videoManagement.inputs.videoURL.name")}.`}
          ref={register({
            required: {
              value: true,
              message: `${t("videoManagement.inputs.videoURL.error")}.`,
            },
          })}
        />
        <Input
          error={errors.thumbnail}
          name="previewUrl"
          required
          className="col-span-2 md:col-span-1"
          variants={fadeInDown}
          placeholder={t("videoManagement.inputs.videoPreviewURL.name")}
          hint={`${t("videoManagement.inputs.videoPreviewURL.name")}.`}
          ref={register({
            required: {
              value: true,
              message: `${t("videoManagement.inputs.videoPreviewURL.error")}.`,
            },
          })}
        />
        <Textarea
          error={errors.description}
          className="col-span-2"
          minHeight={200}
          placeholder={t("videoManagement.inputs.description.name")}
          name="description"
          ref={register({
            required: {
              value: true,
              message: `${t("videoManagement.inputs.description.error")}.`,
            },
          })}
          variants={fadeInDown}
        />
        <Checkbox
          className="col-span-2"
          error={errors.isPublic}
          name="isPublic"
          ref={register()}
          icon={
            watchPrivacy ? (
              <GlobeIcon className="text-green-500 w-6 mr-2" />
            ) : (
              <UserIcon className="text-nx-red w-6 mr-2" />
            )
          }
        >
          <Typography className="text-sm" as="span">
            {watchPrivacy ? (
              <>
                <Typography as="span" bold>
                  {`${t("userVideos.visibility.public.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.visibility.public.description")}.`}
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  {`${t("videoManagement.actions.switching")}.`}
                </Typography>
              </>
            ) : (
              <>
                <Typography as="span" bold>
                  {`${t("userVideos.visibility.private.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.visibility.private.description")}.`}
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  {`${t("videoManagement.actions.switching")}.`}
                </Typography>
              </>
            )}
          </Typography>
        </Checkbox>
        <Checkbox
          className="col-span-2"
          error={errors.isPublished}
          name="isPublished"
          ref={register()}
          icon={
            watchPublished ? (
              <EyeIcon className={"text-green-500 w-6 mr-2"} />
            ) : (
              <EyeOffIcon className="text-nx-red w-6 mr-2" />
            )
          }
        >
          <Typography className="text-sm" as="span">
            {watchPublished ? (
              <>
                <Typography as="span" bold>
                  {`${t("userVideos.status.published.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.status.published.description")}.`}
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  {`${t("videoManagement.actions.switching")}.`}
                </Typography>
              </>
            ) : (
              <>
                <Typography as="span" bold>
                  {`${t("userVideos.status.draft.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.status.draft.description")}.`}
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  {`${t("videoManagement.actions.switching")}.`}
                </Typography>
              </>
            )}
          </Typography>
        </Checkbox>
        {loading && (
          <div className="col-span-2 flex items-center">
            <Spinner className="fill-current text-nx-dark"></Spinner>
            <Typography as="span" className="text-sm ml-2">
              {t("shared.common.wait")}..
            </Typography>
          </div>
        )}
        {alert && (
          <Alert type={alert.type} variants={fadeInDown} className="col-span-2">
            {alert.message}
          </Alert>
        )}
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={
            isUpdate
              ? t("videoManagement.updateVideo.action")
              : t("videoManagement.addVideo.action")
          }
          variants={fadeInDown}
        />
      </form>
    </motion.div>
  );
};
