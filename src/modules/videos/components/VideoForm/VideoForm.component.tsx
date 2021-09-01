import {
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  UserIcon,
  TranslateIcon,
  ArrowCircleLeftIcon,
} from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
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
import { FrameSelector } from "../FrameSelector/FrameSelector.component";
import urlRegex from "url-regex";
import SimpleMdeReact from "react-simplemde-editor";
import { OutlineButton } from "../../../ui";

type Props = {
  /** If video exists, the form will be in update mode, otherwise in create mode. */
  video?: Video | null;
};

/**
 * The video form component
 */
export const VideoForm: React.FC<Props> = ({ video }) => {
  const player = useRef<HTMLVmPlayerElement>(null);
  const isUpdate = video instanceof Video;

  const videoService = useInjection<VideoService>(VideoService);
  const subtitleService = useInjection<SubtitleService>(SubtitleService);
  const minioService = useInjection<MinioService>(MinioService);

  const { t } = useTranslation();
  const { user } = useAuth();
  let history = useHistory();
  const type = new URLSearchParams(useLocation().search).get("type");

  const [autocompleted, setAutocompleted] = useState<boolean>(
    isUpdate || type === "upload"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [subtitleExists, setSubtitleExists] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);

  const {
    register,
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<IVideoForm>({
    defaultValues: {
      title: video?.title,
      description: video?.description,
      isPublished: video?.isPublished || false,
      isPublic: video?.isPublic || false,
      thumbnail: video?.thumbnail,
      src: video?.src,
      attachments: video?.attachments,
    },
  });

  const watchTitle = watch<"title", string>("title", "");
  const watchPrivacy = watch<"isPublic", boolean>("isPublic");
  const watchPublished = watch<"isPublished", boolean>("isPublished");
  const watchHasSubtitle = watch<"hasSubtitle", boolean>("hasSubtitle");
  const watchThumbnail = watch<"thumbnail", string>("thumbnail", "");
  const watchDescription = watch<"description", string>(
    "description",
    t("videoManagement.inputs.description.name")
  );
  const watchAttachments = watch("attachments", []);

  // We need to do this to get the value of textarea that isn't working with only description in useForm
  const [desc, setDesc] = useState<string | undefined>(video?.description);
  const onChange = (value: string) => {
    setValue("description", value);
    setDesc(value);
  };

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

  const uploadFiles = async (data: IVideoForm) => {
    const uploadedFiles = await minioService.upload([
      imageFile as MinioFile,
      videoFile as MinioFile,
    ]);
    const attributes: (keyof IVideoForm)[] = ["thumbnail", "src"];
    attributes.forEach((attr) => {
      const url = getFile(uploadedFiles, attr)?.getFileURL();
      if (url) data = { ...data, [attr]: url };
    });
    return data;
  };

  const thumbnailPreview =
    watchThumbnail ||
    video?.thumbnail ||
    imageFile?.getPreview() ||
    "https://i.stack.imgur.com/y9DpT.jpg";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  });
  const [videoPreview, setVideoPreview] = useState(
    video?.src || videoFile?.getPreview()
  );

  useEffect(() => {
    setVideoPreview(video?.src || videoFile?.getPreview());
  }, [video, videoFile]);

  const onGoBack = () => history.goBack();

  const autocomplete = async () => {
    setLoading(true);
    try {
      const valid = await trigger("src");
      if (valid) {
        const src = getValues("src");
        const id = src.match(/[a-zA-Z0-9_-]{11}/);
        if (id) {
          const metadata = await videoService.getVideoMetadata(id[0]);
          setValue("thumbnail", metadata.snippet?.thumbnails?.high?.url);
          setValue("description", metadata.snippet?.description);
          setValue("title", metadata.snippet?.title);
        }
      }
    } catch (e) {
      setAlert({
        message: `${t("videoManagement.addVideo.error")}`,
        type: "error",
      });
    } finally {
      setAutocompleted(true);
      setLoading(false);
    }
  };

  const onSubmit = async (data: IVideoForm) => {
    setLoading(true);
    setIsSubmit(true);
    try {
      if (type === "upload") data = await uploadFiles(data);
      data.description = desc || "";
      let result = await (isUpdate
        ? videoService.updateVideo(video?.id as string, data)
        : videoService.createVideo(data));
      if (data.hasSubtitle && !subtitleExists)
        await subtitleService.createSubtitle(video || result);
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

  //Editor Options
  const MDOptions = useMemo(() => {
    return {
      autoSave: false,
      // uploadImage: true,
      spellChecker: false,
      sideBySideFullscreen: false,
      minHeight: "550px",
      toolbar: [
        "bold" as const,
        "italic" as const,
        "heading" as const,
        "code" as const,
        "|" as const,
        "quote" as const,
        "unordered-list" as const,
        "table" as const,
        "|" as const,
        "link" as const,
        "image" as const,
        "|" as const,
        "preview" as const,
        "|" as const,
        "guide" as const,
        "|" as const,
      ],
    };
  }, []);

  const save = async () => {
    const provider = await player.current?.getProvider();
    const video = provider?.lastChild?.lastChild as HTMLVideoElement;

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    [canvas.height, canvas.width] = [720, 1280];

    context?.drawImage(video as CanvasImageSource, 0, 0, 1280, 720);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_at_${video.currentTime}sec`);
        const minioFile = new ImageFile(file, "thumbnail");
        setImageFile(minioFile);
      }
    });
  };

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 mx-auto"
    >
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <Typography
          as="span"
          className="text-nx-red col-span-2"
          overrideDefaultClasses
        >
          <span className="inline-flex mx-2 cursor-pointer" onClick={onGoBack}>
            <ArrowCircleLeftIcon className="w-6 mr-1" />{" "}
            {t("shared.common.actions.back")}{" "}
          </span>
        </Typography>
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
      </div>
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <Img
          variants={fadeInDown}
          src={thumbnailPreview}
          className="w-full col-span-2 lg:col-span-1 rounded-md"
          alt={`${watchTitle} thumbnail`}
        />
        {type === "upload" ? (
          <div className="w-full col-span-2 lg:col-span-1 rounded-md overflow-hidden">
            <FrameSelector
              variants={fadeInDown}
              playerRef={player}
              getFrame={save}
              videoPreview={videoPreview as string}
            />
          </div>
        ) : null}
      </div>
      <form
        className="grid items-center grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          disabled={!autocompleted}
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
        {type !== "upload" ? (
          <>
            <Input
              disabled={!autocompleted}
              error={errors.thumbnail}
              name="thumbnail"
              required
              className="col-span-2 md:col-span-1"
              variants={fadeInDown}
              placeholder={t("videoManagement.inputs.thumbnailURL.name")}
              hint={`${t("videoManagement.inputs.thumbnailURL.name")}.`}
              ref={register({
                required: `${t(
                  "videoManagement.inputs.thumbnailURL.missing"
                )}.`,
                pattern: {
                  value: urlRegex({ exact: true }),
                  message: `${t("videoManagement.inputs.thumbnailURL.error")}.`,
                },
              })}
            />
            <Input
              onChange={autocomplete}
              error={errors.src}
              name="src"
              required
              className="col-span-2"
              variants={fadeInDown}
              placeholder={t("videoManagement.inputs.videoURL.name")}
              hint={`${t("videoManagement.inputs.videoURL.name")}.`}
              ref={register({
                required: `${t("videoManagement.inputs.videoURL.missing")}.`,
                pattern: {
                  value:
                    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be|youtube-nocookie.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/gm,
                  message: `${t("videoManagement.inputs.videoURL.error")}.`,
                },
              })}
            />
          </>
        ) : (
          <>
            <UploadButton<ImageFile>
              uploadClass={ImageFile}
              onFileUpload={(file) => setImageFile(file)}
              variants={fadeInDown}
              className="col-span-2 md:col-span-1"
              placeholder={t("videoManagement.inputs.thumbnailUpload")}
              format="image/*"
              name="thumbnail"
            />
            <UploadButton<VideoFile>
              uploadClass={VideoFile}
              onFileUpload={(file) => setVideoFile(file)}
              variants={fadeInDown}
              className="col-span-2"
              placeholder={t("videoManagement.inputs.videoUpload")}
              format="video/*"
              name="src"
            />
          </>
        )}
        <div className="flex flex-col text-center mb-4 col-span-2">
          <ul className="w-full">
            {watchAttachments &&
              fields.map((item, index) => {
                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-4 w-full gap-2 my-2"
                  >
                    <div className="grid grid-flow-row lg:grid-flow-col col-span-3 gap-2">
                      <Controller
                        as={<input />}
                        className="border dark:bg-nx-white focus:outline-none py-2 px-5 rounded-md font-display"
                        name={`attachments[${index}].label`}
                        placeholder={t(
                          "videoManagement.inputs.title.attachment.label"
                        )}
                        control={control}
                        defaultValue={item.label} // make sure to set up defaultValue
                      />
                      <Controller
                        className="border dark:bg-nx-white focus:outline-none py-2 px-5 rounded-md font-display"
                        as={<input />}
                        placeholder={t(
                          "videoManagement.inputs.title.attachment.url"
                        )}
                        name={`attachments[${index}].url`}
                        control={control}
                        defaultValue={item.url} // make sure to set up defaultValue
                      />
                    </div>
                    <OutlineButton
                      as="button"
                      className="col-span-1"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="w-6 m-auto" />
                    </OutlineButton>
                  </li>
                );
              })}
          </ul>
          <FilledButton
            className="font-normal-i"
            as="button"
            onClick={(e) => {
              e.preventDefault();
              append({ label: "", url: "" }, false);
            }}
          >
            {t("videoManagement.inputs.addAttachment")}
          </FilledButton>
        </div>
        <SimpleMdeReact
          className="col-span-2 prose mb-4 max-w-full"
          value={watchDescription}
          onChange={onChange}
          options={MDOptions}
        />
        {/* <Textarea
        <Textarea
          disabled={!autocompleted}
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
        /> */}
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
        {type === "upload" && (
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
                    {`${t("userVideos.subtitle.withSubtitle.name")}.`}
                  </Typography>{" "}
                  {`${t("userVideos.subtitle.withSubtitle.description")}.`}
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
                    {`${t("userVideos.subtitle.withoutSubtitle.name")}.`}
                  </Typography>{" "}
                  {`${t("userVideos.subtitle.withoutSubtitle.description")}.`}
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
        )}
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
