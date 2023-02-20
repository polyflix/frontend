import { environment } from '@env/environment'
import SearchIcon from '@mui/icons-material/Search'
import {
  Backdrop,
  Box,
  Fade,
  InputAdornment,
  Modal,
  Pagination,
  Typography,
} from '@mui/material'
import { SortedPaginatedSearchResult } from '@types_/resources/search.type'
import { SearchService } from '@search/services/search.service'
import { useEffect, useState } from 'react'
import { isMacOs } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import {
  BehaviorSubject,
  debounceTime,
  filter,
  map,
  merge,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs'

import { useInjection } from '@polyflix/di'

import { NoData } from '../NoData/NoData.component'
import { Scrollbar } from '../Scrollbar/Scrollbar.component'
import { SearchSlider } from './SearchSlider.component'
import {
  Search,
  SearchFieldInModal,
  SearchIconWrapper,
} from './Spotlight.style'

interface SpotlightModalProps {
  opened: boolean
  handleOpen: () => void
  handleClose: () => void
}

const MIN_CHAR_SEARCH = 1
const PAGE_SIZE = 5

const query$ = new BehaviorSubject<string>('')
const page$ = new BehaviorSubject<number>(1)
const unsubscribeAll$ = new Subject()

export const SpotlightModal = ({
  opened,
  handleOpen,
  handleClose,
}: SpotlightModalProps) => {
  const searchService = useInjection<SearchService>(SearchService)

  const [data, setData] = useState<SortedPaginatedSearchResult>()

  const isUrl = (url: string) => {
    return url.startsWith('http')
  }

  const buildMinioImageUrl = (url: string) =>
    `${environment.minioUrl}/images/${url}`

  const pageEvent$ = page$.pipe(
    switchMap((p) =>
      searchService.searchFor({
        query: query$.value,
        page: p,
        size: PAGE_SIZE,
      })
    )
  )
  const queryEvent$ = query$.pipe(
    debounceTime(200),
    switchMap((q) =>
      searchService.searchFor({
        query: q,
        page: 1,
        size: PAGE_SIZE,
      })
    )
  )
  useEffect(() => {
    merge(pageEvent$, queryEvent$)
      .pipe(
        filter(() => query$.value.length > MIN_CHAR_SEARCH),
        map((value: SortedPaginatedSearchResult) => ({
          ...value,
          videos: value.videos.map((v) => ({
            ...v,
            thumbnail: isUrl(v.thumbnail)
              ? v.thumbnail
              : buildMinioImageUrl(v.thumbnail),
          })),
        })),
        takeUntil(unsubscribeAll$)
      )
      .subscribe((value: SortedPaginatedSearchResult) => setData(value))

    return () => {
      unsubscribeAll$.complete()
      unsubscribeAll$.unsubscribe()
    }
  }, [])

  const { t } = useTranslation('common')

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
    query$.next(event.target.value)
  }

  const handlePageChange = (newPage: number): void => {
    page$.next(newPage)
  }

  // We put the event listener on the whole document because we have to catch the key pressed no matter where the user is on the page
  useEffect(() => {
    document.addEventListener('keydown', keydownHandler)
    return () => document.removeEventListener('keydown', keydownHandler)
  }, [])

  return (
    <Modal
      open={opened}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={opened}>
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
                    title={t<string>('items.videos', { ns: 'sidebar' })}
                    results={data.videos}
                    query={query$.value}
                    closeModal={handleClose}
                  />
                  <SearchSlider
                    title={t<string>('items.quizzes', { ns: 'sidebar' })}
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
                page={page$.value}
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
  )
}
