import { CalculatorIcon } from '@heroicons/react/outline'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { cn, WithClassname } from '../../../common'
import { Checkbox, Typography } from '../../../ui'

type Props = WithClassname & {
  name?: string
  isChecked?: boolean
}

export const ScoreMethodSelector = forwardRef<HTMLInputElement, Props>(
  ({ name = 'keepHighestScore', className = '', isChecked }, forwardedRef) => {
    const { t } = useTranslation('resources')
    const status = isChecked ? 'max' : 'mean'

    return (
      <Checkbox
        name={name}
        className={className}
        ref={forwardedRef}
        icon={
          <CalculatorIcon
            className={cn(
              isChecked ? 'text-green-500' : 'text-nx-red',
              'w-6 mr-2'
            )}
          />
        }
      >
        <Typography className="text-sm" as="span">
          <Typography as="span" bold>
            {`${t(`quizzes.form.keepHighestScore.${status}.label`)}.`}
          </Typography>{' '}
          {`${t(`quizzes.form.keepHighestScore.${status}.description`)}`}
          <br />
          <Typography
            as="span"
            bold
            className="text-xs text-nx-red"
            overrideDefaultClasses
          >
            {`${t('status.actions.switch')}.`}
          </Typography>
        </Typography>
      </Checkbox>
    )
  }
)
