import { Link, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import {
  SearchResult as ISearchResult,
  SearchQuiz,
  SearchTypes,
  SearchVideo,
} from '@search/models/search.model'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'

import { HighlightedText } from './HighlightedText.component'
import { SearchResult as StyledSearchResult } from './Spotlight.style'

type SearchResultProps = {
  result: ISearchResult
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

  switch (result.type) {
    case SearchTypes.VIDEO:
      link = `/videos/${result.id}`
      icon = 'eva:play-circle-outline'
      title = (result as SearchVideo).title
      description = (result as SearchVideo).description
      break
    case SearchTypes.QUIZ:
      link = `/quizzes/${result.id}/play`
      icon = 'healthicons:i-exam-multiple-choice'
      title = (result as SearchQuiz).name
      break
  }
  return (
    <Link
      underline="none"
      component={RouterLink}
      to={link}
      onClick={() => closeModal()}
    >
      <StyledSearchResult>
        <Box
          sx={{
            width: '20%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={40} />
        </Box>
        <Box
          sx={{
            width: '80%',
            textAlign: 'justify',
          }}
        >
          <Tooltip title={title}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                whiteSpace: 'nowrap',
              }}
              noWrap={true}
            >
              <HighlightedText text={title} search={query} />
            </Typography>
          </Tooltip>
          <HighlightedText text={description} search={query} />
        </Box>
      </StyledSearchResult>
    </Link>
  )
}
