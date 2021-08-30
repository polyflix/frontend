import { useInjection } from '@polyflix/di';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Token, useAuth } from '../../../authentication';
import {
  Alert,
  AlertType,
  fadeInDown,
  FilledButton,
  Input,
  Paragraph,
  Spinner,
  stagger,
  Textarea,
  Title,
  Typography,
} from '../../../ui';
import { Group } from '../../models/group.model';
import { IGroupForm } from '../../types/groups.type';
import { GroupService } from '../../services/group.service';
import { GroupDetails } from '../GroupDetails/GroupDetails.component';

type Props = {
  /** If group exists, the form will be in update mode, otherwise in create mode. */
  group?: Group | null
}

/**
 * The group form component
 */
export const GroupForm: React.FC<Props> = ({ group }) => {
  const groupService = useInjection<GroupService>(GroupService);
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { register, handleSubmit, errors } = useForm<IGroupForm>({
    defaultValues: {
      title: group?.title,
      description: group?.description,
      owner: user?.id,
    },
  });

  const history = useHistory();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
      type: AlertType
      message: string
    } | null>(null);

  const isUpdate = group instanceof Group;

  const onSubmit = async (data: IGroupForm) => {
    setIsSubmit(true);
    setLoading(true);
    try {
      await (isUpdate
        ? groupService.updateGroup(
            group?.id as unknown as string,
            data,
            token as Token,
        )
        : groupService.createGroup(data, token as Token));
      setAlert({
        message: isUpdate
          ? `"${data.title}" ${t('groupManagement.updateGroup.success')}.`
          : `"${data.title}" ${t('groupManagement.addGroup.success')}.`,
        type: 'success',
      });
      history.push('/groups');
    } catch (err) {
      setAlert({
        message: `${t('groupManagement.addGroup.error')} "${data.title}"`,
        type: 'error',
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
              ? `${group?.title}`
              : `${t('shared.common.actions.add')}
							${t('groupManagement.group')}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t('groupManagement.updateGroup.description')}`
              : `${t('groupManagement.addGroup.description')}`}
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
          className="col-span-2 md:col-span-1"
          placeholder={t('groupManagement.inputs.name.name')}
          required
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t('groupManagement.inputs.name.error')}.`,
            },
          })}
        />
        <Textarea
          error={errors.description}
          className="col-span-2"
          minHeight={200}
          placeholder={t('groupManagement.inputs.description.name')}
          name="description"
          ref={register({
            required: {
              value: true,
              message: `${t('groupManagement.inputs.description.error')}.`,
            },
          })}
          variants={fadeInDown}
        />
        {loading && (
          <div className="col-span-2 flex items-center">
            <Spinner className="fill-current text-nx-dark" />
            <Typography as="span" className="text-sm ml-2">
              {t('shared.common.wait')}
              ..
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
              ? t('groupManagement.updateGroup.action')
              : t('groupManagement.addGroup.action')
          }
          disabled={isSubmit}
          variants={fadeInDown}
        />
      </form>
      {!isUpdate || <GroupDetails group={group || null} />}
    </motion.div>
  );
};
