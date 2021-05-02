import { VideoService } from "@core/services/videos/video.service";
import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import fadeInDown from "../../../animations/fadeInDown";
import stagger from "../../../animations/stagger";
import { useAuth } from "../../../hooks/useAuth.hook";
import { Token } from "../../../models/token.model";
import Video from "../../../models/video.model";
import { useInjection } from "../../../modules/di";
import { IVideoForm } from "../../../types/videos.type";
import Alert, { AlertType } from "../../Alert/Alert.component";
import FilledButton from "../../Buttons/FilledButton/FilledButton.component";
import Image from "../../Image/Image.component";
import Spinner from "../../Spinner/Spinner.component";
import Paragraph from "../../Typography/Paragraph/Paragraph.component";
import Title from "../../Typography/Title/Title.component";
import Typography from "../../Typography/Typography.component";
import Checkbox from "../Checkbox/Checkbox.component";
import Input from "../Input/Input.component";
import Textarea from "../Textarea/Textarea.component";

type Props = {
  /** If video exists, the form will be in update mode, otherwise in create mode. */
  video?: Video | null;
};

/**
 * The video form component
 */
const VideoForm: React.FC<Props> = ({ video }) => {
  const videoService = useInjection<VideoService>(VideoService);
  const { token } = useAuth();
  const { register, handleSubmit, errors, watch } = useForm<IVideoForm>({
    defaultValues: {
      title: video?.title,
      description: video?.description,
      thumbnail: video?.thumbnail,
      isPublished: video?.isPublished || false,
      isPublic: video?.isPublic || false,
    },
  });
  const watchTitle = watch<"title", string>("title", "");
  const watchPrivacy = watch<"isPublic", boolean>("isPublic");
  const watchPublished = watch<"isPublished", boolean>("isPublished");
  const watchThumbnail = watch<"thumbnail", string>("thumbnail", "");

  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  const isUpdate = video instanceof Video;

  const onSubmit = async (data: IVideoForm) => {
    setLoading(true);
    try {
      let result = await (isUpdate
        ? videoService.updateVideo(video?.id as string, data, token as Token)
        : videoService.createVideo(data, token as Token));
      setAlert({
        message: isUpdate
          ? `"${result.title}" successfully updated.`
          : `"${result.title}" added to the library.`,
        type: "success",
      });
    } catch (err) {
      setAlert({ message: err, type: "error" });
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
            {isUpdate ? `${video?.title}` : "Add a new video"}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            Fill the form below to {isUpdate ? "update" : "create"} your video.
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
          placeholder="Title"
          required
          variants={fadeInDown}
          hint={
            watchTitle
              ? `UID : ${slugify(watchTitle, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                })}`
              : "The title of the video."
          }
          ref={register({
            required: { value: true, message: "A title is required." },
          })}
        />
        <Input
          error={errors.thumbnail}
          name="thumbnail"
          required
          className="col-span-2 md:col-span-1"
          variants={fadeInDown}
          placeholder="Thumbnail URL"
          hint="The URL of the video thumbnail."
          ref={register({
            required: { value: true, message: "A thumbnail URL is required." },
          })}
        />
        <Textarea
          className="col-span-2"
          minHeight={200}
          placeholder="Video description"
          name="description"
          ref={register({
            required: { value: true, message: "A description is required." },
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
                  Public.
                </Typography>{" "}
                Your video will be visible for everyone.
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  Click to change.
                </Typography>
              </>
            ) : (
              <>
                <Typography as="span" bold>
                  Private.
                </Typography>{" "}
                Your video will be visible only for you.
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  Click to change.
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
                  Published.
                </Typography>{" "}
                Your video can appears in search results (if it is public).
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  Click to change.
                </Typography>
              </>
            ) : (
              <>
                <Typography as="span" bold>
                  Draft.
                </Typography>{" "}
                Your video is still in draft and users cannot see it.
                <br />
                <Typography
                  as="span"
                  bold
                  className="text-xs text-nx-red"
                  overrideDefaultClasses
                >
                  Click to change.
                </Typography>
              </>
            )}
          </Typography>
        </Checkbox>
        {loading && (
          <div className="col-span-2 flex items-center">
            <Spinner className="fill-current text-nx-dark"></Spinner>
            <Typography as="span" className="text-sm ml-2">
              Please wait..
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
          inputValue={isUpdate ? "Update" : "Create"}
          variants={fadeInDown}
        />
      </form>
    </motion.div>
  );
};

export default VideoForm;
