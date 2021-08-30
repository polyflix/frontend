import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useInjection } from '@polyflix/di';
import { Block } from '@polyflix/vtt-parser';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { cn, RootState } from '../../common';
import {
  Alert, AlertType, Spinner, Textarea, Typography,
} from '../../ui';
import { Subtitle } from '../../videos';
import { SubtitleImprovement } from '../models/subtitle-improvement.model';
import { SubtitleFetchingState } from '../pages/collaborative-subtitle-editing.page';
import {
  AddElementFailure,
  AddElementInProgress,
  AddElementSuccess,
  UpdateElementInProgress,
  UpdateElementSuccess,
  UpdateFormElementSuccess,
} from '../redux/actions/subtitle-improvement.action';
import { SubtitleImprovementService } from '../services/subtitle-improvement.service';
import { ISubtitleImprovement } from '../types/subtitle-improvement.type';
import { Button } from './button.component';

type SubtitleBlockFormProps = {
  block: Block
  subtitles: SubtitleFetchingState
}

export const SubtitleBlockForm: React.FC<SubtitleBlockFormProps> = ({
  block,
  subtitles,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const subtitleImprovementService = useInjection<SubtitleImprovementService>(
    SubtitleImprovementService,
  );

  const disableActions = useSelector(
    (state: RootState) => state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
      ?.disableActions,
  );

  const {
    register, handleSubmit, errors, setValue,
  } = useForm<SubtitleImprovement>();

  const [alert, setAlert] = useState<{
      type: AlertType
      message: string
    } | null>(null);

  const initForm = useCallback(
    (
      subtitleImprovement: ISubtitleImprovement = {
        id: undefined,
        comment: block.text,
        subtitle: { id: subtitles.subtitle?.id } as Subtitle,
        timestamp: block.startTime,
      },
    ) => {
      const initFormControls = (formGroup: { [k: string]: any[] }) => {
        for (const controlName in formGroup) {
          register(controlName, {
            required: {
              value: !!formGroup[controlName][1],
              message: `${t('shared.common.form.errors.required')}.`,
            },
          });
          setValue(controlName, formGroup[controlName][0]);
        }
      };

      initFormControls({
        id: [subtitleImprovement.id],
        subtitle: [subtitleImprovement.subtitle],
        comment: [subtitleImprovement.comment, { required: true }],
        likes: [subtitleImprovement.likes],
        timestamp: [subtitleImprovement.timestamp],
        isApproved: [subtitleImprovement.isApproved],
        createdBy: [subtitleImprovement.createdBy],
        subtitleImprovementMeta: [subtitleImprovement.subtitleImprovementMeta],
        createdAt: [subtitleImprovement.createdAt],
        updatedAt: [subtitleImprovement.updatedAt],
      });
      setLoading(false);
    },
    [block.startTime, block.text, register, setValue, subtitles.subtitle, t],
  );

  const editingItem = useSelector(
    (state: RootState) => state.subtitleImprovement.find((e) => e.timestamp === block.startTime)
      ?.editingItem,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    if (editingItem) {
      setIsUpdate(true);
      initForm(editingItem);
    } else {
      setIsUpdate(false);
      initForm();
    }
  }, [setValue, initForm, editingItem]);

  const onSubmit = async (values: SubtitleImprovement) => {
    setIsSubmit(true);
    try {
      if (isUpdate) {
        dispatch(UpdateElementInProgress(block.startTime));
      } else {
        dispatch(AddElementInProgress(block.startTime));
      }

      const result = await (isUpdate
        ? subtitleImprovementService.update(values)
        : subtitleImprovementService.create(values));

      setAlert({
        message: isUpdate
          ? `${t('subtitleImprovement.form.success', {
            action: `${t('shared.common.form.actions.update')}`,
          })}.`
          : `${t('subtitleImprovement.form.success', {
            action: `${t('shared.common.form.actions.create')}`,
          })}.`,
        type: 'success',
      });

      if (isUpdate) {
        dispatch(UpdateElementSuccess(block.startTime, values));
      } else {
        dispatch(
          AddElementSuccess(block.startTime, result as SubtitleImprovement),
        );
      }
    } catch (err) {
      setAlert({
        message: `${t('subtitleImprovement.form.errors.common')}`,
        type: 'error',
      });
      dispatch(AddElementFailure(block.startTime));
    } finally {
      setIsSubmit(false);
    }
  };

  const setCreate = () => {
    setIsUpdate(false);
    dispatch(UpdateFormElementSuccess(block.startTime));
    initForm();
  };

  return (
    <>
      {loading ? (
        <div className="col-span-2 flex items-center gap-2">
          <Spinner
            className="fill-current text-nx-red"
            style={{
              color: 'white',
            }}
          />
          <Typography as="span" className="text-sm ml-2">
            {t('shared.common.wait')}
            ..
          </Typography>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4 rounded p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Textarea
            name="comment"
            error={errors.comment}
            className="col-span-2 md:col-span-1"
            placeholder={t('subtitleImprovement.form.fields.comment')}
            required
            ref={register({
              required: {
                value: true,
                message: `${t('shared.common.form.errors.required')}.`,
              },
            })}
          />
          <div className="flex flex-row gap-4">
            {isUpdate && (
              <Button
                className={cn('bg-nx-red-dark hover:bg-nx-red')}
                type="button"
                onClick={() => setCreate()}
                disabled={isSubmit || disableActions}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
            )}
            <Button
              className={cn('bg-nx-red-dark hover:bg-nx-red flex-1')}
              type="submit"
              disabled={isSubmit || disableActions}
            >
              {isUpdate
                ? t('shared.common.form.actions.update')
                : t('shared.common.form.actions.create')}
            </Button>
          </div>
          {alert && (
            <Alert type={alert.type} className="col-span-2">
              {alert.message}
            </Alert>
          )}
        </form>
      )}
    </>
  );
};
