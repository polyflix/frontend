import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox, Typography } from '../../../ui'
import { WithClassname } from '../../types'

type Props = WithClassname & {
  name?: string
  isChecked?: boolean
}

export const StatusSelector = forwardRef<HTMLInputElement, Props>(
  ({ name = 'draft', className = '', isChecked }, forwardedRef) => {
    const { t } = useTranslation('resources')
    const status = isChecked ? 'draft' : 'published'

    return (
      <Checkbox
        name={name}
        className={className}
        ref={forwardedRef}
        icon={
          !isChecked ? (
            <EyeIcon className="text-green-500 w-6 mr-2" />
          ) : (
            <EyeOffIcon className="text-nx-red w-6 mr-2" />
          )
        }
      >
        <Typography className="text-sm" as="span">
          <Typography as="span" bold>
            {`${t(`status.${status}.label`)}.`}
          </Typography>{' '}
          {`${t(`status.${status}.description`)}`}
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
