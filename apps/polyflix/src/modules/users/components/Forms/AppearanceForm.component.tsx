import { Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { ThemeButton } from '@core/components/ThemeButton/ThemeButton.component'

import { User } from '@types_/user.type'

interface Props {
  user: User
  title: string
}

/**
 * User settings component form
 * @param title
 * @constructor
 */
export const AppearanceForm = ({ title }: Props) => {
  const { t } = useTranslation('common')

  return (
    <Paper elevation={0}>
      <Typography sx={{ mb: 2 }} align="left" variant={'h3'}>
        {title}
      </Typography>
      <Typography sx={{ mb: 2 }} variant={'body1'}>
        {t('appearance.description')}
      </Typography>
      <Grid container columns={2} alignContent={'center'} alignItems={'center'}>
        <ThemeButton />
        <Typography variant={'body1'}>
          {t('appearance.darkmode.informations')}
        </Typography>
      </Grid>
    </Paper>
  )
}
