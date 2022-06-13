import { Avatar, Stack, Tooltip, Typography } from '@mui/material'
import {
  SearchQuiz,
  SearchTypes,
  SearchUser,
  SearchVideo,
} from '@search/models/search.model'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'

import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { HighlightedText } from './HighlightedText.component'
import { ResultThumbnailContainer, SearchCard } from './Spotlight.style'
import { VideoSearchThumbnail } from './VideoSearchThumbnail'

export type Result = SearchVideo | SearchQuiz | SearchUser

type SearchResultProps = {
  result: Result
  query: string
  closeModal: () => void
}

type SearchResultState = {
  link: string
  title: string
  description?: string
  icon: string
}
const defaultSearchResultState: SearchResultState = {
  link: '',
  title: '',
  description: '',
  icon: '',
}

const DESCRIPTION_LENGTH = 150

export const SearchResult: React.FC<SearchResultProps> = ({
  result,
  query,
  closeModal,
}: SearchResultProps) => {
  const [searchResult, setSearchResult] = useState(defaultSearchResultState)

  useEffect(() => {
    switch (result.type) {
      case SearchTypes.VIDEO:
        const rawDescription = (result as SearchVideo).description
        const description =
          rawDescription.length > DESCRIPTION_LENGTH
            ? `${rawDescription.substring(0, DESCRIPTION_LENGTH - 3)}...`
            : rawDescription
        setSearchResult({
          description,
          link: `/videos/${result.slug}`,
          icon: 'eva:play-circle-outline',
          title: (result as SearchVideo).title,
        })
        break
      case SearchTypes.QUIZ:
        setSearchResult({
          link: `/quizzes/${result.id}/play`,
          icon: 'healthicons:i-exam-multiple-choice',
          title: (result as SearchQuiz).name,
          description: '',
        })
        break
      case SearchTypes.USER:
        const fullName = `${(result as SearchUser).firstName} ${
          (result as SearchUser).lastName
        }`
        setSearchResult({
          link: `/users/profile/${result.id}`,
          icon: 'bx:user-circle',
          title: fullName,
        })
        break
    }
  }, [])

  let displayResultThumbnail = () => {
    switch (result.type) {
      case SearchTypes.VIDEO:
        return (
          <VideoSearchThumbnail
            thumbnailUrl={(result as SearchVideo)?.thumbnail}
          />
        )
      case SearchTypes.QUIZ:
        return <Icon name={searchResult.icon} />
      case SearchTypes.USER:
        return (
          <Avatar
            src={(result as SearchUser).avatar}
            alt={`${searchResult.title} profile picture`}
          />
        )
    }
  }

  return (
    <SearchCard
      underline="none"
      color="inherit"
      component={RouterLink}
      to={searchResult.link}
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
        <Tooltip title={searchResult.title} followCursor>
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
            <HighlightedText text={searchResult.title} search={query} />
          </Typography>
        </Tooltip>
        {searchResult.description && (
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
            <HighlightedText text={searchResult.description} search={query} />
          </Typography>
        )}
      </Stack>
    </SearchCard>
  )
}
