import { Divider } from '@mui/material'
import { isUndefined } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { CourseForm } from '@courses/components/CourseForm/CourseForm.component'
import { useGetCourseQuery } from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

export const CreateUpdateCoursePage = () => {
  const { t } = useTranslation('courses')
  const { slug } = useParams<{ slug: string }>()
  const fetchFilters = useMemo<CoursesFilters>(() => ({}), [])

  const { data, isLoading } = useGetCourseQuery(
    { slug, filters: fetchFilters },
    { skip: !slug }
  )

  const i18nKey = isUndefined(data) ? 'create' : 'update'

  return (
    <Page isLoading={isLoading} title={t('form.upsert.title.create')}>
      <Header
        title={t(`form.upsert.title.${i18nKey}`)}
        description={t(`form.upsert.description.${i18nKey}`)}
      />
      <Divider sx={{ my: 3 }} />

      <CourseForm course={data} />
    </Page>
  )
}
