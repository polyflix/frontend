import { Box, Divider, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionCardSkeleton } from '@collections/components/CollectionCardSkeleton/CollectionCardSkeleton.component'

import { CourseCard } from '@courses/components/CourseCard/CourseCard.component'
import { Course } from '@types_/resources/course.type'
import { useGetCoursesQuery } from '@shared/services/resources/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

import { getUsernameToDisplay } from '@users/helpers/displayUsername.helper'
import { User } from '@types_/user.type'

import { polyflixRouter } from '@routes/index'

type Props = {
  user: User | undefined
}

export const ProfileCoursesPage: React.FC<Props> = ({ user }: Props) => {
  const { t } = useTranslation('users')
  const { user: me } = useAuth()
  const isMe = me && user && me.id === user.id
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<CoursesFilters>({
    order: 'createdAt',
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetCoursesQuery({
    userId: user!.id,
    ...filters,
  })

  const courses: Course[] = data?.data || []
  const skeletons = buildSkeletons(3)
  let totalPage = Math.ceil((data?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page
      disableGutters={true}
      title={
        isMe
          ? t('profile.tabs.courses.content.title')
          : `${t(
              'profile.tabs.courses.contentOther.title'
            )} ${getUsernameToDisplay(user!)}`
      }
      sx={{ mt: 3, pt: 0 }}
    >
      <Header
        sx={{
          mb: 0,
        }}
        title={
          isMe
            ? t('profile.tabs.courses.content.title')
            : `${t(
                'profile.tabs.courses.contentOther.title'
              )} ${getUsernameToDisplay(user!)}`
        }
        description={
          isMe
            ? t('profile.tabs.courses.content.description')
            : `${t(
                'profile.tabs.courses.contentOther.description'
              )} ${getUsernameToDisplay(user!)}.`
        }
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        {/* <Searchbar
          onChange={(search) => {
            setFilters({
              ...filters,
              search: {
                $and: [
                  [
                    {
                      name: {
                        $contL: search,
                      },
                    },
                  ],
                  {
                    'user.id': {
                      $eq: user!.id,
                    },
                  },
                ],
              },
            })
          }}
          label={t('navbar.actions.search.fast', { ns: 'common' })}
        /> */}

        {/* If there is more than 10 items, we display a limit item per page selector */}
        {data?.total! > 10 && (
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
          />
        )}
      </Stack>

      <Grid sx={{ my: 3 }} container columnSpacing={2} rowSpacing={4}>
        {!isFetching
          ? courses.map((item: Course) => (
              <Grid key={item.id} item xs={12} sm={6} md={6} lg={4}>
                <CourseCard course={item} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <CollectionCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {courses.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        !isLoading && (
          <NoData
            variant="courses"
            link={polyflixRouter().studio.courses.create}
          />
        )
      )}
    </Page>
  )
}
