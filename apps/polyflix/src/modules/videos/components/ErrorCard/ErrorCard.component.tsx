import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Stitch from '../../../../assets/images/stitch.png'

type Props = {
  content?: string
}

export const ErrorCard: React.FC<Props> = () => {
  const { t } = useTranslation('videos')
  return (
    <Box
      sx={{
        width: 320,
        margin: 'auto',
        textAlign: 'center',
        borderRadius: '5px',
        backgroundColor: '#4B5563',
      }}
    >
      <Box sx={{ mt: 1, py: 1 }} mx={{ py: 4 }}>
        <img height={'100'} src={Stitch} alt={'Stitch is waiting for you'} />
        <ErrorOutlineIcon
          style={{ color: '#FF0000', display: 'block', margin: 'auto' }}
          className="w-9 pt-4 mx-auto"
        />
        <Typography sx={{ mx: '5%' }} color={'#E4E4E4'} fontWeight={600}>
          {t('playerFailed')}
        </Typography>
      </Box>
    </Box>
  )
}
