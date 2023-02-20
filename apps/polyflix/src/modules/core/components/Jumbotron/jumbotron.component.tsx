import { Visibility } from '@types_/resources/content.type'
import {
  alpha,
  Box,
  IconButton,
  InputBase,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
  SxProps,
  Theme,
  Paper,
  Alert,
  Link,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useGetVideosQuery } from '@videos/services/video.service'
import { Autoplay, EffectFade, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { AutoScrollBox } from '../AutoScrollBox/AutoScrollBox.component'
import { Icon } from '../Icon/Icon.component'
import { ImageCover } from '../ImageCover/image-cover.component'
import { ListVideoCard } from '../ListVideoCard/list-video-card.component'
import { useTranslation } from 'react-i18next'
import { buildSkeletons } from '@core/utils/gui.utils'
import { Link as RouterLink } from 'react-router-dom'
import { videoSlugLink } from '@core/helpers/video.helper'
import { SpotlightModal } from '../Spotlight/SpotlightModal.component'
import { useState } from 'react'

const HomeSearchBarRootStyled = styled(Paper)(({ theme }) => ({
  maxWidth: 'clamp(900px, 70vw, 1450px)',
  width: '100%',
  padding: theme.spacing(1),
  margin: '0 auto',
  display: 'flex',
  transition: ' outline-color .2s cubic-bezier(0,1,1,.5)',
  outline: `solid 2px ${'#f0f0f0'}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: `${theme.spacing(2)} !important`,
  },
  [theme.breakpoints.up('md')]: {
    transform: 'translateY(50%)',
  },
}))

type SearchBarProps = {
  sx?: SxProps<Theme>
}

export const HomeSearchBar = ({ sx }: SearchBarProps) => {
  const [modalOpened, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <HomeSearchBarRootStyled variant="outlined" sx={sx}>
        <InputBase
          sx={{ ml: 1, flex: 1, width: '100%' }}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          onClick={handleOpen}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </HomeSearchBarRootStyled>
      <SpotlightModal
        opened={modalOpened}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </>
  )
}

const StyledSwiper = styled(Swiper)(() => ({
  '& .swiper-pagination-bullet.swiper-pagination-bullet-active': {
    background: 'red !important',
  },
}))

const JumbotronMainTile = () => {
  const { t } = useTranslation('common')

  const { data, isLoading } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-views',
    page: 1,
    pageSize: 5,
  })

  if (isLoading) {
    return (
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <AspectRatioBox ratio={16 / 9}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </AspectRatioBox>
      </Box>
    )
  }

  if (!isLoading && !data?.items?.length) {
    return (
      <AspectRatioBox ratio={16 / 9}>
        <Alert severity="info">{t('noData.title')}</Alert>
      </AspectRatioBox>
    )
  }

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <AspectRatioBox ratio={16 / 9}>
        <StyledSwiper
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectFade, Autoplay, Pagination]}
        >
          {(data?.items || []).map((video, i) => (
            <SwiperSlide key={i}>
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                <Link component={RouterLink} to={videoSlugLink(video)}>
                  <ImageCover ratio={16 / 9} src={video.thumbnail || ''} />
                </Link>
                <Typography
                  variant="body1"
                  color="Background"
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    background: (theme) =>
                      alpha(theme.palette.common.black, 0.7),
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    maxWidth: '65%',
                  }}
                  noWrap
                >
                  {video.title}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </AspectRatioBox>
    </Box>
  )
}

const JumbotronSecondaryTile = () => {
  const { t } = useTranslation('home')

  const { data, isLoading, isError } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    page: 1,
    pageSize: 5,
    isWatched: true,
  })

  const skeletons = buildSkeletons(5)

  const content = () => {
    if (isError) {
      return (
        <Alert severity="error">{t('error.title', { ns: 'common' })}</Alert>
      )
    }
    if (isLoading) {
      return (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            width: '100%',
            height: '100%',
          }}
        >
          {skeletons.map((i) => (
            <Skeleton variant="rectangular" height={55} key={i} />
          ))}
        </Stack>
      )
    }

    if (!isLoading && !data?.items.length) {
      return (
        <Alert severity="info">{t('noData.title', { ns: 'common' })}</Alert>
      )
    }

    return (data?.items || []).map((video, index) => (
      <ListVideoCard video={video} key={index} />
    ))
  }

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack
        sx={{ flex: 1, minWidth: 0 }}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <Icon name="eva:play-circle-outline" />
        <Typography variant="h4" color="inherit">
          {t('jumbotron.slider.titles.continue')}
        </Typography>
      </Stack>
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <AutoScrollBox>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            {content()}
          </Stack>
        </AutoScrollBox>
      </Box>
    </Stack>
  )
}

export const Jumbotron = () => {
  const theme = useTheme()
  const gtmd: boolean = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          alignItems: 'end',
          gridTemplateColumns: {
            sm: '1fr',
            md: '2fr 1fr',
          },
          gap: {
            sm: 2,
            md: 4,
          },
        }}
      >
        <JumbotronMainTile />
        {gtmd && <JumbotronSecondaryTile />}
      </Box>
      <HomeSearchBar sx={{ outlineColor: 'bg' }} />
    </>
  )
}
