import { PlusIcon } from "@heroicons/react/solid";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTags } from "../../../tags/hooks/useTag.hook";
import { Tag } from "../../../tags/models/tag.model";
import { fadeOpacity } from "../../../ui/animations/fadeOpacity";
import { Container } from "../../../ui/components/Container/Container.component";
import { Jumbotron } from "../../../ui/components/Jumbotron/Jumbotron.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { TagListItem } from "../../../tags/components/TagListItem.component";
import { useInjection } from "@polyflix/di";
import { TagService } from "../../../tags/services/tag.service";
import { ITagForm } from "../../../tags/types/tag.type";
import { Input } from "../../../ui";
import { useForm } from "react-hook-form";

export const AdminTagsPage: React.FC = () => {
  const { t } = useTranslation();
  const tagService = useInjection<TagService>(TagService);
  const { data: allTags, refresh } = useTags({ showAll: true });
  const { register, handleSubmit, reset } = useForm<ITagForm>();

  const onDelete = async (tag: Tag) => {
    await tagService.deleteTag(tag.id);
    refresh();
  };

  const onReviewed = async (tag: Tag) => {
    await tagService.updateTag(tag.id, {
      label: tag.label,
      isReviewed: !tag.isReviewed,
    });
    refresh();
  };

  const onCreate = async (tag: ITagForm) => {
    if (tag.label === "") return;
    reset();
    await tagService.createTag({ isReviewed: true, label: tag.label });
    refresh();
  };

  return (
    <Page
      variants={fadeOpacity}
      title={t("admin.onBoarding.tags.title")}
      className="pb-2"
    >
      <Container mxAuto className="mt-5">
        <Jumbotron
          withGoBack={true}
          title={t("admin.onBoarding.tags.title")}
          content={t("shared.common.form.tags.adminDescription")}
        />
        <div className="mt-5 flex w-full">
          <form onSubmit={handleSubmit(onCreate)} className="w-2/3">
            <Input
              name="label"
              placeholder={t("shared.common.form.tags.createTag")}
              ref={register()}
            />
          </form>
          <Typography
            as="span"
            className="flex items-center text-nx-red"
            overrideDefaultClasses
          >
            <span
              className="inline-flex mx-2 cursor-pointer"
              onClick={handleSubmit(onCreate)}
            >
              <PlusIcon className="w-8" />
            </span>
          </Typography>
        </div>
        <div className="mx-5">
          {allTags && (
            <>
              {allTags.map((tag: Tag) => (
                <TagListItem
                  key={tag.id}
                  tag={tag}
                  onReviewed={onReviewed}
                  onDelete={onDelete}
                ></TagListItem>
              ))}
            </>
          )}
        </div>
      </Container>
    </Page>
  );
};
