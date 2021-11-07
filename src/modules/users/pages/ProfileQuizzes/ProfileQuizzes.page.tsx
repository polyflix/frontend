import { Container, Divider, Pagination, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { buildQuizzSearch } from '@quizzes/helpers/search.helper'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

export const ProfileQuizzesPage = () => {
  const { user } = useAuth()
  const { t } = useTranslation('users')

  const [filters, setFilters] = useState<Partial<QuizzFilters>>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: 1,
    limit: 10,
  })

  const { data } = useGetQuizzesQuery({
    join: [{ field: 'user', select: ['firstName', 'lastName'] }, 'questions'],
    'user.id': user?.id,
    ...filters,
  })

  return (
    <Container disableGutters={true} maxWidth={false} sx={{ mt: 3 }}>
      <Header
        title={t('profile.tabs.quizzes.content.title')}
        description={t('profile.tabs.quizzes.content.description')}
      />
      <Divider sx={{ my: 3 }} />
      <Stack justifyContent="space-between" direction="row">
        <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: { $or: [...buildQuizzSearch(search)] },
            })
          }}
          label={t('search', { ns: 'quizzes' })}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>
      <Grid sx={{ my: 3 }} container spacing={2}>
        {data?.data.map((item: Quizz) => (
          <Grid key={item.id} item xs={12} lg={6}>
            <QuizzCard
              variant="none"
              displayCrudOptions
              displayPublisher={false}
              displayTags
              displayScoreMethod
              quizz={item}
            />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={data?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  )
}
