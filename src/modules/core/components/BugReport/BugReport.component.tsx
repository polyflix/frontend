import { IconButton, Link, Stack, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'

export const BugReport: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Tooltip title={t<string>('navbar.actions.bugReport')}>
        <IconButton>
          <Link
            href={
              'https://docs.google.com/forms/d/e/1FAIpQLScy8UUG38btVXtym4UTBWrJKaOAMRA8-zY2yxCCeUyYolTjOA/viewform'
            }
            target="_blank"
            color="inherit"
          >
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Icon name="ion:bug-outline" />
            </Stack>
          </Link>
        </IconButton>
      </Tooltip>
    </>
  )
}
