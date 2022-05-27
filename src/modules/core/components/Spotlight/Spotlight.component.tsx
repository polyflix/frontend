import SearchIcon from '@mui/icons-material/Search'
import { ClickAwayListener, useMediaQuery, useTheme } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import {
  PaginatedSearchResult,
  SearchResult,
} from '@search/models/search.model'
import { SearchService } from '@search/services/search.service'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { BehaviorSubject, debounceTime, filter, map, switchMap } from 'rxjs'

import { useInjection } from '@polyflix/di'

/** Importing search bar related styles */
import {
  boxStyles,
  Search,
  SearchField,
  SearchFieldInModal,
  SearchIconWrapper,
} from './Spotlight.style'

const changeHandler$ = new BehaviorSubject('')

export const Spotlight: React.FC<PropsWithChildren<{}>> = ({}) => {
  const theme = useTheme()
  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  const [query, setQuery] = useState('kotlin')

  const changeHandler = new Subject()

  changeHandler
    .asObservable()
    .pipe(
      map((event: any) => event.target.value),
      debounceTime(500)
    )
    .subscribe((value) => {
      setQuery(value)
      refetch()
    })

  const [data, setData] = useState<SearchResult[]>([])

  useEffect(() => {
    changeHandler$
      .pipe(
        filter((q) => q.length >= 3),
        debounceTime(500),
        switchMap((value: string) => searchService.searchFor(value)),
        map((value: PaginatedSearchResult) => value.results)
      )
      .subscribe((value) => setData(value))
    return () => changeHandler$.unsubscribe()
  }, [])

  const { t } = useTranslation('common')

  // Manipulation display of modal
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // As searchbar is in wip state, we want to show tooltip on mobile by clicking on it
  const [, setMobileTooltipState] = useState(false)
  const showMobileTooltip = () => setMobileTooltipState(true)
  const hideMobileTooltip = () => setMobileTooltipState(false)

  /**
   *  Match crtl + k binding
   * @param e event catched by keydown listener
   */
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
        <ClickAwayListener onClickAway={hideMobileTooltip}>
          <SearchIcon onClick={showMobileTooltip} />
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
                onChange={(newValue) => changeHandler.next(newValue)}
                // onChange={(e) => setQuery(e.target.value)}
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
              <ul>
                {data && data.map((i: any) => <li key={i.id}>{i.id}</li>)}
              </ul>
            </Search>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
