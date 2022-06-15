import SearchIcon from '@mui/icons-material/Search'
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

/** Importing search bar related styles */
import { Search, SearchField, SearchIconWrapper } from './Spotlight.style'
import { SpotlightModal } from './SpotlightModal.component'

export const Spotlight: React.FC<PropsWithChildren<{}>> = ({}) => {
  const { t } = useTranslation('common')

  const theme = useTheme()

  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  // Manipulation display of modal
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: {
            lg: 'none',
            xs: 'flex',
          },
          color: 'grey.600',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip title={t<string>('navbar.actions.search.fast')}>
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Search
        sx={{
          marginRight: 4,
          display: {
            lg: 'block',
            xs: 'none',
          },
        }}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>

        <SearchField
          onClick={handleOpen}
          placeholder={
            shortText ? '' : t('navbar.actions.search.default') + '..'
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2">
                  {isMacOs ? '⌘' : 'Ctrl'}+K
                </Typography>
              </InputAdornment>
            ),
            disableUnderline: true,
            readOnly: true,
          }}
          variant="filled"
        />
      </Search>

      {/* Modal hidden by default, triggered by keydown or searchBar click */}
      <SpotlightModal
        opened={modalOpened}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </>
  )
}
