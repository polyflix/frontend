import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Course } from "../../models";
import { SearchCourse } from "../SearchCourse/SearchCourse.component";
import { CourseService } from "../../services";
import { ICourseForm } from "../../types";
import { CollectionListItem } from "../../../collections/components/CollectionListItem/CollectionListItem.component";
import { Collection } from "../../../collections/models/collections.model";
import { useAuth } from "../../../authentication/hooks/useAuth.hook";
type Props = {
  /** If course exists, the form will be in update mode, otherwise in create mode. */
  course?: Course | null;
};

/**
 * The course form component
 */
export const CourseForm: React.FC<Props> = ({ course }) => {
  const isUpdate = course instanceof Course;

  const courseService = useInjection<CourseService>(CourseService);

  const { t } = useTranslation();
  const { user } = useAuth();
  let history = useHistory();

  const { register, handleSubmit, errors, watch } = useForm<ICourseForm>({
    defaultValues: {
      title: course?.title,
      content: course?.content,
    },
  });

  const watchTitle = watch<"title", string>("title", "");

  const [collections, setCollections] = useState<Collection[]>(
    course?.collections ?? []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [alert, setAlert] =
    useState<{
      type: AlertType;
      message: string;
    } | null>(null);

  const onCollectionDelete = (id: string) => {
    setCollections(collections.filter((collection) => collection.id !== id));
  };

  const addCollection = (collection: Collection) => {
    const contain = collections.some(
      (el: Collection) => el.id === collection.id
    );
    if (!contain) setCollections([...collections, collection]);
  };

  const onSubmit = async (data: ICourseForm) => {
    setLoading(true);
    setIsSubmit(true);
    try {
      let result = await (isUpdate
        ? courseService.updateCourse(course?.id as string, {
            ...data,
            collections: collections.map((v) => ({ id: v.id })),
          })
        : courseService.createCourse({
            ...data,
            collections: collections.map((v) => ({ id: v.id })),
          }));
      setAlert({
        message: isUpdate
          ? `"${result.title}" ${t(
              "courseManagement.updateCourse.success"
            )}.TOTO`
          : `"${result.title}" ${t("courseManagement.addCourse.success")}.`,
        type: "success",
      });
      history.push(`/profile/courses/${user?.id}`);
    } catch (err) {
      setAlert({
        message: `${t("courseManagement.addCourse.error")} "${data.title}"`,
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
              ? `${course?.title}`
              : `${t("shared.common.actions.add")}
							${t("courseManagement.course")}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t("courseManagement.updateCourse.description")}`
              : `${t("courseManagement.addCourse.description")}`}
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
          placeholder={t("courseManagement.inputs.title.name")}
          required
          variants={fadeInDown}
          hint={
            watchTitle
              ? `UID : ${slugify(watchTitle, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                })}`
              : `${t("courseManagement.inputs.title.description")}.`
          }
          ref={register({
            required: {
              value: true,
              message: `${t("courseManagement.inputs.title.error")}.`,
            },
          })}
        />
        <Textarea
          error={errors.content}
          className="col-span-2"
          minHeight={200}
          placeholder={t("courseManagement.inputs.description.name")}
          name="content"
          ref={register({
            required: {
              value: true,
              message: `${t("courseManagement.inputs.description.error")}.`,
            },
          })}
          variants={fadeInDown}
        />
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={
            isUpdate
              ? t("courseManagement.updateCourse.action")
              : t("courseManagement.addCourse.action")
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
        <SearchCourse
          variants={fadeInDown}
          placeholder={t("courseManagement.inputs.search.name")}
          addCollection={addCollection}
        />
        <>
          {collections.map((collection: Collection) => (
            <CollectionListItem
              collection={collection}
              ownerItems={false}
              links={false}
              onDelete={() => onCollectionDelete(collection.id)}
            />
          ))}
        </>
      </div>
    </motion.div>
  );
};