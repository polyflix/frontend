import { Stack, Tooltip, Typography, Avatar } from '@mui/material'
import {
  SearchQuiz,
  SearchTypes,
  SearchVideo,
  SearchUser,
} from '@search/models/search.model'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'

import { VideoCardThumbnail } from '@videos/components/VideoCard/VideoCard.style'

import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { HighlightedText } from './HighlightedText.component'
import { ResultThumbnailContainer, SearchCard } from './Spotlight.style'

type SearchResultProps = {
  result: SearchVideo | SearchQuiz | SearchUser
  query: string
  closeModal: () => void
}

export const SearchResult: React.FC<SearchResultProps> = ({
  result,
  query,
  closeModal,
}: SearchResultProps) => {
  let link = ''
  let title = ''
  let description = ''
  let icon = ''

  const DESCRIPTION_LENGTH = 150

  switch (result.type) {
    case SearchTypes.VIDEO:
      link = `/videos/${result.id}`
      icon = 'eva:play-circle-outline'
      title = (result as SearchVideo).title
      description = (result as SearchVideo).description
      description =
        description.length > DESCRIPTION_LENGTH
          ? `${description.substring(0, DESCRIPTION_LENGTH - 3)}...`
          : description
      break
    case SearchTypes.QUIZ:
      link = `/quizzes/${result.id}/play`
      icon = 'healthicons:i-exam-multiple-choice'
      title = (result as SearchQuiz).name
      break
    case SearchTypes.USER:
      link = `/users/profile/${result.id}`
      icon = 'bx:user-circle'
      title = `${(result as SearchUser).firstName} ${
        (result as SearchUser).lastName
      }`
      break
  }

  const displayResultThumbnail = () => {
    switch (result.type) {
      case SearchTypes.VIDEO:
        return (
          <VideoCardThumbnail
            loading="lazy"
            src={(result as SearchVideo).thumbnail}
            onError={(e: any) => {
              e.target.src = '/images/dumb_thumbnail.jpg'
              e.preventDefault()
              e.onerror = null
            }}
            alt={`${title} thumbnail`}
          />
        )
      case SearchTypes.QUIZ:
        return <Icon name={icon} />
      case SearchTypes.USER:
        return (
          <Avatar
            src={(result as SearchUser).avatar}
            alt={`${title} profile picture`}
          />
        )
    }
  }

  return (
    <SearchCard
      underline="none"
      color="inherit"
      component={RouterLink}
      to={link}
      onClick={closeModal}
    >
      <AspectRatioBox ratio={16 / 9}>
        <ResultThumbnailContainer>
          {displayResultThumbnail()}
        </ResultThumbnailContainer>
      </AspectRatioBox>
      <Stack
        sx={{
          mt: {
            xs: 1,
            sm: 2,
          },
          paddingLeft: {
            xs: 0,
            sm: 1,
          },
          paddingRight: {
            xs: 0,
            sm: 1,
          },
          paddingBottom: 1,
        }}
        direction="column"
      >
        <Tooltip title={title} followCursor>
          <Typography
            fontWeight="bold"
            variant="subtitle1"
            noWrap={true}
            sx={{
              fontSize: {
                xs: '0.8rem',
                md: '1rem',
              },
            }}
          >
            <HighlightedText text={title} search={query} />
          </Typography>
        </Tooltip>
        {description && (
          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'left',
              fontSize: {
                xs: '0.7rem',
                md: '0.9rem',
              },
              lineHeight: 1,
            }}
            variant="body2"
          >
            <HighlightedText text={description} search={query} />
          </Typography>
        )}
      </Stack>
    </SearchCard>
  )
}
