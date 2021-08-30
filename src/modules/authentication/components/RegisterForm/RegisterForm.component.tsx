import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInjection } from '@polyflix/di';
import { fadeInDown } from '../../../ui/animations/fadeInDown';
import { stagger } from '../../../ui/animations/stagger';
import { Alert } from '../../../ui/components/Alert/Alert.component';
import { FilledButton } from '../../../ui/components/Buttons/FilledButton/FilledButton.component';
import { Input } from '../../../ui/components/Input/Input.component';
import { Spinner } from '../../../ui/components/Spinner/Spinner.component';
import { Paragraph } from '../../../ui/components/Typography/Paragraph/Paragraph.component';
import { Title } from '../../../ui/components/Typography/Title/Title.component';
import { Typography } from '../../../ui/components/Typography/Typography.component';
import { useAuth } from '../../hooks/useAuth.hook';
import { AuthService } from '../../services/auth.service';
import { IRegisterForm } from '../../types/auth.type';

/**
 * The register form component
 */
export const RegisterForm: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService);
  const handleRegister = (data: IRegisterForm) => authService.register(data);
  const { authError, isLoading } = useAuth();
  const {
    register, handleSubmit, errors, watch,
  } = useForm<IRegisterForm>();
  const { t } = useTranslation();

  return (
    <motion.div
      variants={stagger(0.1)}
      className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
    >
      <Title variants={fadeInDown}>{t('auth.signUp.seo.title')}</Title>
      <Paragraph variants={fadeInDown} className="my-3">
        {t('auth.signUp.seo.description')}
        .
      </Paragraph>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleRegister)}
      >
        <Input
          error={errors.firstName}
          name="firstName"
          className="col-span-1"
          placeholder={t('auth.signUp.inputs.firstname.name')}
          required
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t('auth.signUp.inputs.firstname.error')}.`,
            },
          })}
        />
        <Input
          error={errors.lastName}
          name="lastName"
          required
          className="col-span-1"
          placeholder={t('auth.signUp.inputs.lastname.name')}
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t('auth.signUp.inputs.lastname.error')}.`,
            },
          })}
        />
        <Input
          error={errors.email}
          required
          name="email"
          placeholder={t('auth.inputs.email.name')}
          className="col-span-2"
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t('auth.inputs.email.error')}.`,
            },
          })}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          className="col-span-2"
          required
          variants={fadeInDown}
          placeholder={t('auth.inputs.password.name')}
          hint={t('auth.inputs.password.description')}
          ref={register({
            minLength: {
              value: 8,
              message: `${t('auth.inputs.password.description')}.`,
            },
            required: {
              value: true,
              message: `${t('auth.inputs.password.error')}.`,
            },
          })}
        />
        <Input
          error={errors.passwordConfirm}
          name="passwordConfirm"
          type="password"
          required
          className="col-span-2"
          variants={fadeInDown}
          placeholder={t('auth.signUp.inputs.passwordConfirm.name')}
          ref={register({
            validate: (value) => value === watch('password')
              || `${t('auth.signUp.inputs.passwordConfirm.error')}.`,
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
        {authError && <Alert type="error">{t('auth.signUp.error')}</Alert>}
        <FilledButton
          variants={fadeInDown}
          disabled={isLoading}
          as="input"
          className="col-span-2"
          inputValue={t('auth.signUp.action')}
        />
      </form>
      <Paragraph variants={fadeInDown} className="mt-2">
        {t('auth.signUp.footer.0')}
        {' '}
        <Link to="/auth/login">
          <Typography as="span" bold>
            {t('auth.signUp.footer.1')}
            .
          </Typography>
        </Link>
      </Paragraph>
    </motion.div>
  );
};
