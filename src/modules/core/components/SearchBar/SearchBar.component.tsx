import SearchIcon from '@mui/icons-material/Search'
import { useMediaQuery, useTheme } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

/** Importing search bar related styles */
import {
  boxStyles,
  Search,
  SearchField,
  SearchFieldInModal,
  SearchIconWrapper,
} from './SearchBar.style'

export const SearchBar: React.FC<PropsWithChildren<{}>> = ({}) => {
  const theme = useTheme()
  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  const { t } = useTranslation('common')

  // Manipulation display of modal
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  /**
   *  Match crtl + k binding
   * @param e event catched by keydown listener
   */
  function keydownHandler(e: KeyboardEvent) {
    // *keyCode look's like to be deprecated but no fix for the moment
    if (e.keyCode === 75 && (isMacOs ? e.metaKey : e.ctrlKey)) {
      e.preventDefault() // disable default browser binding if triggered
      handleOpen()
    }
  }

  // We put the event listener on the whole document because we have to catch the key pressed no matter where the user is on the page
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  }, [])

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          padding: 1,
          display: {
            lg: 'none',
            xs: 'flex',
          },
          color: 'grey.600',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchIcon />
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
          }}
          variant="filled"
        />
      </Search>

      {/* Modal hidden by default, triggered by keydown or searchBar click */}
      <Modal
        open={modalOpened}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpened}>
          <Box sx={boxStyles}>
            {/* The modal box dialog */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <SearchFieldInModal
                autoFocus
                placeholder={t('navbar.actions.search.fast')}
                InputProps={{
                  'aria-label': 'search',
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2">esc</Typography>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
                variant="filled"
              />
            </Search>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
