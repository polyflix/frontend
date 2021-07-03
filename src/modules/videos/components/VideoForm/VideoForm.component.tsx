import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  UserIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import slugify from "slugify";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import { fadeInDown } from "../../../ui/animations/fadeInDown";
import { stagger } from "../../../ui/animations/stagger";
import { Alert, AlertType } from "../../../ui/components/Alert/Alert.component";
import { FilledButton } from "../../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Checkbox } from "../../../ui/components/Checkbox/Checkbox.component";
import { Image as Img } from "../../../ui/components/Image/Image.component";
import { Input } from "../../../ui/components/Input/Input.component";
import { Spinner } from "../../../ui/components/Spinner/Spinner.component";
import { Textarea } from "../../../ui/components/Textarea/Textarea.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Title } from "../../../ui/components/Typography/Title/Title.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Video } from "../../models/video.model";
import { VideoService } from "../../services/video.service";
import { IVideoForm } from "../../types/videos.type";
import { UploadButton } from "../../../ui/components/Buttons/UploadButton/UploadButton.component";
import { ImageFile } from "../../../upload/models/files/image.model";
import { VideoFile } from "../../../upload/models/files/video.model";
import { MinioService } from "../../../upload/services/minio.service";
import { MinioFile } from "../../../upload/models/files/minio-file.model";
import { SubtitleService } from "../../services";

type Props = {
  /** If video exists, the form will be in update mode, otherwise in create mode. */
  video?: Video | null;
};

/**
 * The video form component
 */
export const VideoForm: React.FC<Props> = ({ video }) => {
  const isUpdate = video instanceof Video;

  const videoService = useInjection<VideoService>(VideoService);
  const subtitleService = useInjection<SubtitleService>(SubtitleService);
  const minioService = useInjection<MinioService>(MinioService);

  const { t } = useTranslation();
  const { user } = useAuth();
  let history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [subtitleExists, setSubtitleExists] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);
  const [files, setFiles] = useState<MinioFile[]>([]);

  const { register, handleSubmit, errors, watch, setValue } =
    useForm<IVideoForm>({
      defaultValues: {
        title: video?.title,
        description: video?.description,
        isPublished: video?.isPublished || false,
        isPublic: video?.isPublic || false,
        thumbnail: video?.thumbnail,
        src: video?.previewUrl,
        previewUrl: video?.src,
      },
    });

  const watchTitle = watch<"title", string>("title", "");
  const watchPrivacy = watch<"isPublic", boolean>("isPublic");
  const watchPublished = watch<"isPublished", boolean>("isPublished");
  const watchHasSubtitle = watch<"hasSubtitle", boolean>("hasSubtitle");

  useEffect(() => {
    async function checkSubtitleExists() {
      if (isUpdate) {
        const sub = await subtitleService.getSubtitleUrlByVideoId(video?.id!);
        setValue("hasSubtitle", sub.length > 0);
        setSubtitleExists(sub.length > 0);
      }
    }
    checkSubtitleExists();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getFile = (files: MinioFile[], field: keyof IVideoForm) => {
    return files.find((file) => file.getField() === field);
  };

  const thumbnailFile = getFile(files, "thumbnail");
  const thumbnailPreview =
    video?.thumbnail ||
    (thumbnailFile as ImageFile)?.getPreview() ||
    "https://i.stack.imgur.com/y9DpT.jpg";

  const onSubmit = async (data: IVideoForm) => {
    setLoading(true);
    setIsSubmit(true);
    try {
      const uploadedFiles = await minioService.upload(files);
      const attributes: (keyof IVideoForm)[] = [
        "thumbnail",
        "src",
        "previewUrl",
      ];
      attributes.forEach((attr) => {
        const url = getFile(uploadedFiles, attr)?.getFileURL();
        if (url) data = { ...data, [attr]: url };
      });

      let result = await (isUpdate
        ? videoService.updateVideo(video?.id as string, data)
        : videoService.createVideo(data));
      if (data.hasSubtitle && !subtitleExists)
        await subtitleService.createSubtitle(video?.id || result.id);
      else if (!data.hasSubtitle && subtitleExists)
        await subtitleService.deleteSubtitle(video?.id!);
      setAlert({
        message: isUpdate
          ? `"${result.title}" ${t("videoManagement.updateVideo.success")}.`
          : `"${result.title}" ${t("videoManagement.addVideo.success")}.`,
        type: "success",
      });
      history.push(`/profile/videos/${user?.id}`);
    } catch (err) {
      setAlert({
        message: `${t("videoManagement.addVideo.error")} "${data.title}"`,
        type: "error",
      });
    } finally {
      setLoading(false);
      setIsSubmit(false);
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
        <Img
          variants={fadeInDown}
          src={thumbnailPreview}
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
        <UploadButton<ImageFile>
          uploadClass={ImageFile}
          onFileUpload={(file) => setFiles([...files, file])}
          variants={fadeInDown}
          className="col-span-2 md:col-span-1"
          placeholder="Uploader la miniature"
          format="image/*"
          name="thumbnail"
        />
        <UploadButton<VideoFile>
          uploadClass={VideoFile}
          onFileUpload={(file) => setFiles([...files, file])}
          variants={fadeInDown}
          className="col-span-2 md:col-span-1"
          placeholder="Uploader la vidéo"
          format="video/*"
          name="src"
        />
        <UploadButton<VideoFile>
          uploadClass={VideoFile}
          onFileUpload={(file) => setFiles([...files, file])}
          variants={fadeInDown}
          className="col-span-2 md:col-span-1"
          placeholder="Uploader la vidéo de prévisualisation"
          format="video/*"
          name="previewUrl"
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
        <Checkbox
          className="col-span-2"
          name="hasSubtitle"
          ref={register()}
          icon={
            watchHasSubtitle ? (
              <TranslateIcon className="text-green-500 w-6 mr-2" />
            ) : (
              <TranslateIcon className="text-nx-red w-6 mr-2" />
            )
          }
        >
          <Typography className="text-sm" as="span">
            {watchHasSubtitle ? (
              <>
                <Typography as="span" bold>
                  {`${t("userVideos.subtitle.withSubtile.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.subtitle.withSubtile.description")}.`}
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
                  {`${t("userVideos.subtitle.withoutSubtile.name")}.`}
                </Typography>{" "}
                {`${t("userVideos.subtitle.withoutSubtile.description")}.`}
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
          disabled={isSubmit}
          variants={fadeInDown}
        />
      </form>
    </motion.div>
  );
};
