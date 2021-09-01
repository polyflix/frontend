import { ArrowCircleLeftIcon, PlusIcon, XIcon } from "@heroicons/react/outline";
import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import slugify from "slugify";
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
import { Select } from "../../../ui/components/Select/select.component";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import { range } from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import { Tag } from "../../../tags/models/tag.model";
import { TagSelect } from "../../../tags/components/TagSelect.component";
registerLocale("fr", fr);

type Props = {
  /** If collection exists, the form will be in update mode, otherwise in create mode. */
  collection?: Collection | null;
};

/**
 * The collection form component
 */
export const CollectionForm: React.FC<Props> = ({ collection }) => {
  const locale = localStorage.getItem("i18nextLng") || "fr";

  const isUpdate = collection instanceof Collection;

  const collectionService = useInjection<CollectionService>(CollectionService);

  const { t } = useTranslation();
  const { user } = useAuth();
  let history = useHistory();

  const { register, handleSubmit, errors, watch, control } =
    useForm<ICollectionForm>({
      defaultValues: {
        title: collection?.title,
        description: collection?.description,
        availability: collection?.availability,
        passwords: collection?.passwords,
      },
    });

  const watchTitle = watch<"title", string>("title", "");

  const [videos, setVideos] = useState<Video[]>(collection?.videos ?? []);
  const [tags, setTags] = useState<Tag[]>(collection?.tags || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);
  const [numberOfPasswords, setNumberOfPasswords] = useState<number>(
    collection?.passwords.length || 0
  );

  const passwordsPlaceholders = range(0, numberOfPasswords);

  const onVideoDelete = (id: string) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  const addVideo = (video: Video) => {
    const contain = videos.some((el: Video) => el.id === video.id);
    if (!contain) setVideos([...videos, video]);
  };

  const onGoBack = () => history.goBack();

  const onSubmit = async (data: ICollectionForm) => {
    setLoading(true);
    setIsSubmit(true);
    try {
      if (collection && collection.id && data.passwords)
        data.passwords.forEach((pwd) => {
          pwd.collectionId = collection.id;
        });
      let result = await (isUpdate
        ? collectionService.updateCollection(collection?.id as string, {
            ...data,
            videos: videos.map((v) => ({ id: v.id })),
            tags: tags?.map((tag) => ({ id: tag.id })),
          })
        : collectionService.createCollection({
            ...data,
            videos: videos.map((v) => ({ id: v.id })),
            tags: tags?.map((tag) => ({ id: tag.id })),
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
      history.push(`/profile/collections/${user?.id}`);
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
              ? `${collection?.title}`
              : `${t("shared.common.actions.add")}
							${t("collectionManagement.collection")}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t("collectionManagement.updateCollection.description")}`
              : `${t("collectionManagement.addCollection.description")}`}
          </Paragraph>
        </div>
      </div>
      <form
        className="grid items-center grid-cols-1 gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
        id="collectionForm"
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
        <motion.div className="bg-darkgray p-8 rounded" variants={fadeInDown}>
          <Typography as="h2" className="col-span-12 pb-4">
            Mot de passe(s)
          </Typography>

          {passwordsPlaceholders.map((i) => {
            const name = `passwords[${i}].name`;
            const password = `passwords[${i}].password`;
            const expiration = `passwords[${i}].expiration`;

            return (
              <div className="grid grid-cols-12 gap-4 py-4" key={i}>
                <Input
                  error={errors.passwords && errors.passwords[i]?.name}
                  type="text"
                  name={name}
                  placeholder="Nom"
                  variants={fadeInDown}
                  ref={register({
                    required: "Le nom du mot de passe est requis",
                  })}
                  hint="Nom"
                  className="col-span-4"
                  defaultValue={new Date().toISOString()}
                />
                <Input
                  error={errors.passwords && errors.passwords[i]?.password}
                  type="password"
                  name={password}
                  placeholder="Mot de passe"
                  variants={fadeInDown}
                  ref={register({
                    required: "Le mot de passe est requis",
                  })}
                  hint="Mot de passe"
                  className="col-span-3"
                />
                <motion.div
                  className="flex flex-col col-span-4"
                  variants={fadeInDown}
                >
                  <Controller
                    name={expiration}
                    control={control}
                    render={({ onChange, value }) => (
                      <DatePicker
                        selected={value && new Date(value)}
                        minDate={new Date()}
                        onChange={onChange}
                        showTimeSelect
                        timeFormat="p"
                        dateFormat="Pp"
                        className="w-full py-3 px-5 rounded-md dark:bg-nx-white focus:outline-none"
                        locale={locale}
                        isClearable
                      />
                    )}
                  />
                  <small className="text-gray-400">Date d'expiration</small>
                </motion.div>
                <XIcon
                  onClick={() => setNumberOfPasswords(numberOfPasswords - 1)}
                  className="w-6 transition-all transform hover:scale-125 cursor-pointer text-nx-red col-span-1 py-3"
                />
              </div>
            );
          })}

          <motion.div
            onClick={() => setNumberOfPasswords(numberOfPasswords + 1)}
            className="col-span-12 hover:text-nx-red cursor-pointer transition-all flex-col flex items-center justify-center border-dashed border-2 rounded-md border-lightgray p-4 text-lightgray"
          >
            <PlusIcon className="w-8 transition-all" />
            <Typography
              overrideDefaultClasses
              className="transition-all"
              as="h6"
            >
              Ajouter un mot de passe
            </Typography>
          </motion.div>
        </motion.div>
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
      </form>
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <div className="col-span-2">
          <TagSelect
            defaultTags={collection?.tags || []}
            onChange={setTags}
            tags={tags}
            variants={fadeInDown}
          />
        </div>
        <Select
          options={
            numberOfPasswords > 0 ? ["protected"] : ["public", "private"]
          }
          form="collectionForm"
          className="col-span-2"
          name="availability"
          hint={`${t("collectionManagement.inputs.select.description")}.`}
          ref={register({
            required: {
              value: true,
              message: `${t("collectionManagement.inputs.description.error")}.`,
            },
          })}
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

        <FilledButton
          form="collectionForm"
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
        {alert && (
          <Alert type={alert.type} variants={fadeInDown} className="col-span-2">
            {alert.message}
          </Alert>
        )}
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
