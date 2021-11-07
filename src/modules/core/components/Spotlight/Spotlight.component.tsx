import SearchIcon from '@mui/icons-material/Search'
import {
  ClickAwayListener,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

/** Importing search bar related styles */
import {
  boxStyles,
  Search,
  SearchField,
  SearchFieldInModal,
  SearchIconWrapper,
} from './Spotlight.style'

export const Spotlight: React.FC<PropsWithChildren<{}>> = ({}) => {
  const theme = useTheme()
  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  const { t } = useTranslation('common')

  // Manipulation display of modal
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => console.log('This feature is currently disabled') //() => setOpen(true)
  const handleClose = () => setOpen(false)

  // As searchbar is in wip state, we want to show tooltip on mobile by clicking on it
  const [mobileTooltipState, setMobileTooltipState] = useState(false)
  const showMobileTooltip = () => setMobileTooltipState(true)
  const hideMobileTooltip = () => setMobileTooltipState(false)

  /*  /!**
   *  Match crtl + k binding
   * @param e event catched by keydown listener
   *!/
  function keydownHandler(e: KeyboardEvent) {
    if (e.key === 'k' && (isMacOs ? e.metaKey : e.ctrlKey)) {
      e.preventDefault() // disable default browser binding if triggered
      handleOpen()
    }
  }

  // We put the event listener on the whole document because we have to catch the key pressed no matter where the user is on the page
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  }, [])*/

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
        <ClickAwayListener onClickAway={hideMobileTooltip}>
          <Tooltip
            title={t('soon')}
            open={mobileTooltipState}
            onClose={hideMobileTooltip}
            PopperProps={{
              disablePortal: true,
            }}
          >
            <SearchIcon onClick={showMobileTooltip} />
          </Tooltip>
        </ClickAwayListener>
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
        <Tooltip title={t<string>('soon')}>
          <SearchField
            onClick={handleOpen}
            disabled
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
        </Tooltip>
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
