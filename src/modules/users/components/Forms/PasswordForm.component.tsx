import { useInjection } from '@polyflix/di';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../authentication';
import {
  Alert,
  AlertType,
  fadeInDown,
  FilledButton,
  Input,
  Spinner,
  stagger,
  Title,
  Typography,
} from '../../../ui';
import { UserService } from '../../services';
import { IUserPasswordForm } from '../../types';

/**
 * The password form component
 */
export const PasswordForm: React.FC = () => {
  const userService = useInjection<UserService>(UserService);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
      type: AlertType
      message: string
    } | null>(null);

  const {
    register, handleSubmit, errors, watch, reset,
  } = useForm<IUserPasswordForm>();
  const { t } = useTranslation();

  const handleUpdate = async (data: IUserPasswordForm) => {
    setAlert(null);
    try {
      setIsLoading(true);
      await userService.updateUser(user?.id!, data);
      setAlert({
        message: t('userProfile.messages.successPassword'),
        type: 'success',
      });
      reset();
    } catch (e) {
      setAlert({
        message: `${t('userProfile.form.badPassword')} (${e})`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={stagger(0.1)} className="py-5 w-full">
      <Title variants={fadeInDown}>{t('userProfile.form.editPassword')}</Title>
      <form
        className="mt-4 grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <Input
          error={errors.currentPassword}
          name="currentPassword"
          type="password"
          className="col-span-2"
          variants={fadeInDown}
          required
          placeholder={t('userProfile.form.currentPassword.name')}
          ref={register({
            minLength: {
              value: 8,
              message: `${t('auth.inputs.password.description')}.`,
            },
            required: {
              value: true,
              message: `${t('auth.inputs.password.description')}.`,
            },
          })}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          className="col-span-2"
          variants={fadeInDown}
          required
          placeholder={t('userProfile.form.newPassword.name')}
          ref={register({
            minLength: {
              value: 8,
              message: `${t('auth.inputs.password.description')}.`,
            },
            required: {
              value: true,
              message: `${t('auth.inputs.password.description')}.`,
            },
          })}
        />
        <Input
          error={errors.passwordConfirm}
          name="passwordConfirm"
          type="password"
          className="col-span-2"
          variants={fadeInDown}
          required
          placeholder={t('userProfile.form.newPasswordConfirm.name')}
          ref={register({
            validate: (value) => value === watch('password')
              || `${t('auth.signUp.inputs.passwordConfirm.error')}.`,
            required: {
              value: true,
              message: `${t('auth.inputs.password.description')}.`,
            },
          })}
        />
        {isLoading && (
          <div className="flex items-center">
            <Spinner className="fill-current text-nx-dark" />
            <Typography as="span" className="text-sm ml-2">
              {t('shared.common.wait')}
              ..
            </Typography>
          </div>
        )}
        {alert && (
          <Alert type={alert.type} className="col-span-2">
            {alert.message}
          </Alert>
        )}
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={t('userProfile.form.editPassword')}
          variants={fadeInDown}
          onClick={() => setAlert(null)}
        />
      </form>
    </motion.div>
  );
};
