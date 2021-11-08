import { Box, Divider, Grid, Pagination, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { Visibility } from '@core/models/content.model'
import { Element } from '@core/models/element.model'

import { QuizzCard } from '@quizzes/components/QuizzCard/QuizzCard.component'
import { buildQuizzSearch } from '@quizzes/helpers/search.helper'
import { Quizz } from '@quizzes/models/quizz.model'
import { useGetQuizzesQuery } from '@quizzes/services/quizz.service'
import { QuizzFilters } from '@quizzes/types/filters.type'

export const ExploreQuizzesPage = () => {
  const { t } = useTranslation('quizzes')

  // Useful states for filtering purposes
  const [filters, setFilters] = useState<QuizzFilters>({
    sort: [{ field: 'createdAt', order: 'DESC' }],
    page: 1,
    limit: 10,
  })

  // Fetch the quizzes
  const { data: quizzes, isLoading } = useGetQuizzesQuery({
    join: [
      {
        field: 'element.user',
        select: ['firstName', 'lastName', 'avatar'],
      },
      { field: 'questions', select: ['label'] },
    ],
    'element.visibility': Visibility.PUBLIC,
    'element.draft': false,
    ...filters,
  })

  return (
    <Page isLoading={isLoading} title={t('explore.title')}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
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
          label={t('search')}
        />
        <ItemsPerPage onChange={(limit) => setFilters({ ...filters, limit })} />
      </Stack>

      <Grid sx={{ my: 3 }} container spacing={2}>
        {quizzes?.data && quizzes?.data.length > 0 ? (
          quizzes?.data.map((item: Element<Quizz>) => (
            <Grid key={item.id} item xs={12} md={4}>
              <QuizzCard displayTags quizz={item} />
            </Grid>
          ))
        ) : (
          <NoData variant="quizzes" link="/quizzes/create" />
        )}
      </Grid>

      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={quizzes?.pageCount}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
