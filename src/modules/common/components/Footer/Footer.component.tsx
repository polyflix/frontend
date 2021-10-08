import React from 'react'
import { useTranslation } from 'react-i18next'

import { WithClassname } from '../../../common/types/props.type'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import {
  LEGAL_NOTICES_URL,
  REPORT_BUG_URL,
} from '../../constants/footer.constant'
import { cn } from '../../utils/classes.util'

type Props = WithClassname

/**
 * The footer component
 */
export const Footer: React.FC<Props> = ({ className = '' }) => {
  const { t } = useTranslation()

  return (
    <footer
      className={cn(
        className,
        'flex flex-col w-full items-center text-nx-gray text-xs p-4'
      )}
    >
      <ul className="mb-3">
        <li className="mb-1">
          <a href={LEGAL_NOTICES_URL} target="_blank" rel="noopener noreferrer">
            <Typography
              className="hover:underline cursor-pointer"
              overrideDefaultClasses
              as="span"
            >
              {t('shared.footer.legalNotices')}
            </Typography>
          </a>
        </li>
        <li>
          <a href={REPORT_BUG_URL} target="_blank" rel="noopener noreferrer">
            <Typography
              className="hover:underline cursor-pointer"
              overrideDefaultClasses
              as="span"
            >
              {t('shared.footer.reportBug')}
            </Typography>
          </a>
        </li>
      </ul>
      <Typography overrideDefaultClasses as="span">
        {t('shared.footer.copyright')}
      </Typography>
    </footer>
  )
}
