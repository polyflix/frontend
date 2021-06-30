import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import slugify from "slugify";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import { fadeInDown } from "../../../ui/animations/fadeInDown";
import { stagger } from "../../../ui/animations/stagger";
import { Alert, AlertType } from "../../../ui/components/Alert/Alert.component";
import { FilledButton } from "../../../ui/components/Buttons/FilledButton/FilledButton.component";
import { Input } from "../../../ui/components/Input/Input.component";
import { Spinner } from "../../../ui/components/Spinner/Spinner.component";
import { Textarea } from "../../../ui/components/Textarea/Textarea.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Title } from "../../../ui/components/Typography/Title/Title.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Collection } from "../../models";
import { SearchCollection } from "../SearchCollection/SearchCollection.component";
import { CollectionService } from "../../services";
import { ICollectionForm } from "../../types";
import { VideoListItem } from "../../../videos/components/VideoListItem/VideoListItem.component";
import { Video } from "../../../videos/models/video.model";
type Props = {
  /** If collection exists, the form will be in update mode, otherwise in create mode. */
  collection?: Collection | null;
};

/**
 * The collection form component
 */
export const CollectionForm: React.FC<Props> = ({ collection }) => {
  const isUpdate = collection instanceof Collection;

  const collectionService = useInjection<CollectionService>(CollectionService);

  const { t } = useTranslation();
  const { user } = useAuth();
  let history = useHistory();

  const { register, handleSubmit, errors, watch } = useForm<ICollectionForm>({
    defaultValues: {
      title: collection?.title,
      description: collection?.description,
    },
  });

  const watchTitle = watch<"title", string>("title", "");

  const [videos, setVideos] = useState<Video[]>(collection?.videos ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const onVideoDelete = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  const addVideo = (video: Video) => {
    let contain: boolean = false;
    videos.forEach((el: Video) => {
      if (el.id === video.id) {
        contain = true;
      }
    });
    if (!contain) setVideos([...videos, video]);
  };

  const onSubmit = async (data: ICollectionForm) => {
    setLoading(true);
    setIsSubmit(true);
    try {
      let result = await (isUpdate
        ? collectionService.updateCollection(collection?.id as string, {
            ...data,
            videos: videos.map((v) => ({ id: v.id })),
          })
        : collectionService.createCollection({
            ...data,
            videos: videos.map((v) => ({ id: v.id })),
          }));
      setAlert({
        message: isUpdate
          ? `"${result.title}" ${t(
              "collectionManagement.updateCollection.success"
            )}.TOTO`
          : `"${result.title}" ${t(
              "collectionManagement.addCollection.success"
            )}.`,
        type: "success",
      });
      history.push(`/profile/videos/${user?.id}`);
    } catch (err) {
      setAlert({
        message: `${t("collectionManagement.addCollection.error")} "${
          data.title
        }"`,
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
              ? `${collection?.title}`
              : `${t("shared.common.actions.add")}
							${t("collectionManagement.collection")}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t("collectionManagement.updateCollection.description")}`
              : `${t("collectionManagement.addCollection.description")}`}
            .
          </Paragraph>
        </div>
      </div>
      <form
        className="grid items-center grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="title"
          error={errors.title}
          className="col-span-2"
          placeholder={t("collectionManagement.inputs.title.name")}
          required
          variants={fadeInDown}
          hint={
            watchTitle
              ? `UID : ${slugify(watchTitle, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                })}`
              : `${t("collectionManagement.inputs.title.description")}.`
          }
          ref={register({
            required: {
              value: true,
              message: `${t("collectionManagement.inputs.title.error")}.`,
            },
          })}
        />
        <Textarea
          error={errors.description}
          className="col-span-2"
          minHeight={200}
          placeholder={t("collectionManagement.inputs.description.name")}
          name="description"
          ref={register({
            required: {
              value: true,
              message: `${t("collectionManagement.inputs.description.error")}.`,
            },
          })}
          variants={fadeInDown}
        />
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={
            isUpdate
              ? t("collectionManagement.updateCollection.action")
              : t("collectionManagement.addCollection.action")
          }
          disabled={isSubmit}
          variants={fadeInDown}
        />
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
      </form>
      <div className="mt-4">
        <SearchCollection
          variants={fadeInDown}
          placeholder={t("collectionManagement.inputs.search.name")}
          addVideo={addVideo}
        ></SearchCollection>
        <>
          {videos.map((video: Video) => (
            <VideoListItem
              video={video}
              ownerItems={false}
              links={false}
              onDelete={() => onVideoDelete(video.id)}
            />
          ))}
        </>
      </div>
    </motion.div>
  );
};
