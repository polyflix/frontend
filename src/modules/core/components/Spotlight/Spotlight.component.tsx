import SearchIcon from '@mui/icons-material/Search'
import {
  IconButton,
  Pagination,
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
import { SortedPaginatedSearchResult } from '@search/models/search.model'
import { SearchService } from '@search/services/search.service'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import {
  BehaviorSubject,
  debounceTime,
  filter,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs'

import { useInjection } from '@polyflix/di'

import { NoData } from '@core/components/NoData/NoData.component'

import { Scrollbar } from '../Scrollbar/Scrollbar.component'
import { SearchSlider } from './SearchSlider.component'

/** Importing search bar related styles */
import {
  Search,
  SearchField,
  SearchFieldInModal,
  SearchIconWrapper,
} from './Spotlight.style'

const query$ = new BehaviorSubject<string>('')
const page$ = new BehaviorSubject<number>(1)
const unsubscribeAll$ = new Subject()

const MIN_CHAR_SEARCH = 3
const PAGE_SIZE = 10

export const Spotlight: React.FC<PropsWithChildren<{}>> = ({}) => {
  const theme = useTheme()
  const shortText = useMediaQuery(theme.breakpoints.down('sm'))

  const searchService = useInjection<SearchService>(SearchService)

  const [data, setData] = useState<SortedPaginatedSearchResult>()
  const [page, setPage] = useState(1)

  const executeSearch = (query: string, pageNumber: number) => {
    return searchService.searchFor({
      query: query,
      page: pageNumber,
      size: PAGE_SIZE,
    })
  }

  useEffect(() => {
    page$
      .pipe(
        switchMap((p) => executeSearch(query$.value, p)),
        takeUntil(unsubscribeAll$)
      )
      .subscribe((value: SortedPaginatedSearchResult) => setData(value))
    query$
      .pipe(
        filter((q: string) => q.length >= MIN_CHAR_SEARCH),
        debounceTime(300),
        switchMap((q) => executeSearch(q, 1)),
        takeUntil(unsubscribeAll$)
      )
      .subscribe((value: SortedPaginatedSearchResult) => setData(value))
    return () => {
      unsubscribeAll$.complete()
      unsubscribeAll$.unsubscribe()
    }
  }, [])

  const { t } = useTranslation('common')
  const { t: tS } = useTranslation('sidebar')

  // Manipulation display of modal
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
    setPage(1)
    query$.next(event.target.value)
  }

  const handlePageChange = (newPage: number): void => {
    page$.next(newPage)
    setPage(newPage)
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
              maxWidth: '850px',
              top: '50%',
              left: '50%',
              width: '80%',
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
                  defaultValue={query$.value}
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
                  <Scrollbar
                    sx={{
                      maxHeight: '70vh',
                    }}
                  >
                    <SearchSlider
                      title={tS<string>('items.videos')}
                      results={data.videos}
                      query={query$.value}
                      closeModal={handleClose}
                    />
                    <SearchSlider
                      title={tS<string>('items.quizzes')}
                      results={data.quizzes}
                      query={query$.value}
                      closeModal={handleClose}
                    />
                    {/* <SearchSlider
                      title={tS<string>('administration.resources.users')}
                      results={data.users}
                      query={query$.value}
                      closeModal={handleClose}
                    /> */}
                  </Scrollbar>
                )}
              </Search>
              {data &&
                data.totalElements === 0 &&
                query$.value.length >= MIN_CHAR_SEARCH && (
                  <NoData creatable={false} />
                )}
              {data && data.totalPages > 1 && (
                <Pagination
                  onChange={(_, p) => handlePageChange(p)}
                  page={page}
                  count={data?.totalPages || 1}
                  shape="rounded"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1%',
                  }}
                />
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
