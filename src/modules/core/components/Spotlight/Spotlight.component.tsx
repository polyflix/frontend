import SearchIcon from '@mui/icons-material/Search'
import { ClickAwayListener, useMediaQuery, useTheme } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { PaginatedSearchResult } from '@search/models/search.model'
import { SearchService } from '@search/services/search.service'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { BehaviorSubject, debounceTime, filter, switchMap } from 'rxjs'

import { useInjection } from '@polyflix/di'

import { SearchResult as SearchResultComponent } from './SearchResult.component'

/** Importing search bar related styles */
import {
  Search,
  SearchField,
  SearchFieldInModal,
  SearchIconWrapper,
} from './Spotlight.style'

const changeHandler$ = new BehaviorSubject('')
const MIN_CHAR_SEARCH = 3

export const Spotlight: React.FC<PropsWithChildren<{}>> = ({}) => {
  const theme = useTheme()
  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  const searchService = useInjection<SearchService>(SearchService)

  const [data, setData] = useState<PaginatedSearchResult>()
  const [query, setQuery] = useState<string>()

  useEffect(() => {
    changeHandler$
      .pipe(
        filter((q) => q.length >= MIN_CHAR_SEARCH),
        debounceTime(500),
        switchMap((q: string) => searchService.searchFor(q))
      )
      .subscribe((value: PaginatedSearchResult) => setData(value))
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

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const querry = event.target.value
    changeHandler$.next(querry)
    setQuery(querry)
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
          <Box
            sx={{
              position: 'absolute',
              maxWidth: '1500px',
              top: '50%',
              left: '50%',
              width: '100%',
              transform: 'translate(-50%, -50%)',
              p: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 1,
                boxShadow: 10,
                bgcolor: 'background.paper',
              }}
            >
              {/* The modal box dialog */}
              <Search>
                <SearchFieldInModal
                  onChange={handleSearchChange}
                  autoFocus
                  helperText={t('navbar.actions.search.hint', {
                    count: MIN_CHAR_SEARCH,
                  })}
                  placeholder={t('navbar.actions.search.fast')}
                  InputProps={{
                    'aria-label': 'search',
                    startAdornment: (
                      <SearchIconWrapper sx={{ paddingLeft: 1 }}>
                        <SearchIcon />
                      </SearchIconWrapper>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2">esc</Typography>
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="filled"
                />
                {data && (
                  <Box>
                    {data.results.map((result) => (
                      <SearchResultComponent
                        key={result.id}
                        result={result}
                        query={query || ''}
                        closeModal={handleClose}
                      />
                    ))}
                  </Box>
                )}
              </Search>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
