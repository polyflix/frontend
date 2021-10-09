import { useInjection } from "@polyflix/di";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { ActionMeta, OptionsType } from "react-select/src/types";

import { Tag } from "../models/tag.model";
import { ITagForm } from "../types/tag.type";
import { useTags } from "../hooks/useTag.hook";
import { TagService } from "../services/tag.service";
import { WithClassname, WithMotion } from "../../common";

type Props = WithMotion &
  WithClassname & {
    defaultTags?: Tag[];
    onChange: (tags: Tag[]) => void;
    tags: Tag[];
    isForm?: boolean;
  };

type FormattedTag = {
  value: string;
  label: string;
};

export const TagSelect: React.FC<Props> = ({
  defaultTags = [],
  tags,
  onChange,
  isForm = true,
  ...props
}) => {
  const { t } = useTranslation();
  const { data: allTags } = useTags({});

  const formatTags = (tags: Tag[]): FormattedTag[] => {
    return tags.map((tag) => ({ value: tag.id, label: tag.label }));
  };
  const tagService = useInjection<TagService>(TagService);

  const handleChange = async (
    _values: OptionsType<FormattedTag>,
    actionMeta: ActionMeta<FormattedTag>
  ) => {
    switch (actionMeta.action) {
      case "create-option":
        const create = actionMeta as any;
        try {
          const newTag = await tagService.createTag({
            label: create.option.label,
            isReviewed: false,
          } as ITagForm);
          onChange([...tags, newTag]);
        } catch (e) {
          typeof e === "string" &&
            onChange([
              ...tags,
              Tag.fromJson({
                id: e,
                isReviewed: false,
                label: create.option.label,
              }),
            ]);
        }
        break;
      case "remove-value":
      case "pop-value":
        onChange(
          tags.filter((tag) => tag.id !== actionMeta.removedValue.value)
        );
        break;
      case "select-option":
        if (actionMeta.option)
          onChange([
            ...tags,
            Tag.fromJson({
              id: actionMeta.option.value,
              label: actionMeta.option.label,
              isReviewed: false,
            }),
          ]);
        break;
      case "clear":
        onChange([]);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div {...props}>
      {isForm ? (
        <>
          <CreatableSelect
            isMulti
            onChange={handleChange}
            defaultValue={(() => formatTags(defaultTags))()}
            options={(() => formatTags(allTags || []))()}
            value={(() => formatTags(tags))()}
            placeholder={t("shared.common.form.tags.description")}
            noOptionsMessage={() =>
              t("shared.common.form.tags.noOptionsMessage")
            }
          />
          <small className="text-gray-400">
            {t("shared.common.form.tags.name")}
          </small>
        </>
      ) : (
        <Select
          isMulti
          onChange={handleChange}
          options={(() => formatTags(allTags || []))()}
          value={(() => formatTags(tags))()}
          placeholder={t("shared.navbar.search.placeholder")}
          noOptionsMessage={() => t("shared.navbar.search.noOptionsMessage")}
          className="whitespace-nowrap overflow-ellipsis"
        />
      )}
    </motion.div>
  );
};
