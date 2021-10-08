import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import {
  fadeInDown,
  FilledButton,
  Input,
  Paragraph,
  stagger,
  Title,
  Typography,
} from '../../../ui'

type Props = {
  /** Redirection when the form is submitted. */
  redirection: string
}

export const CollectionPassword: React.FC<Props> = ({ redirection }) => {
  const { t } = useTranslation()
  let history = useHistory()

  const onGoBack = () => history.goBack()

  const { register, handleSubmit, errors } = useForm<{
    password: string
  }>({})

  const onSubmit = async (data: { password: string }) => {
    history.push(`${redirection}${data.password}`)
  }

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
            <ArrowCircleLeftIcon className="w-6 mr-1" />{' '}
            {t('shared.common.actions.back')}{' '}
          </span>
        </Typography>
        <div className="col-span-2 md:col-span-1">
          <Title variants={fadeInDown}>Entrez un mot de passe</Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            Cette collection est protégée. Un mot de passe est requis pour y
            accéder.
          </Paragraph>
        </div>
      </div>
      <form
        className="grid items-center grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          error={errors.password}
          required
          type="password"
          name="password"
          className="col-span-2"
          placeholder={t('auth.inputs.password.name')}
          variants={fadeInDown}
          ref={register({
            required: {
              value: true,
              message: `${t('auth.inputs.password.error')}.`,
            },
          })}
        />
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue="Accéder à la collection"
          variants={fadeInDown}
        />
      </form>
    </motion.div>
  )
}
