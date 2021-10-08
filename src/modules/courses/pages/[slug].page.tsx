import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { Redirect, useParams } from 'react-router'

import { CollectionList } from '../../collections/components'
import { cn } from '../../common/utils/classes.util'
import { Paragraph, Typography } from '../../ui'
import { fadeOpacity } from '../../ui/animations/fadeOpacity'
import { Container } from '../../ui/components/Container/Container.component'
import { Page } from '../../ui/components/Page/Page.component'
import { useCourse } from '../hooks'
import { Course } from '../models'
import styles from './slug.module.scss'

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  const isMdScreen = useMediaQuery({ query: '(max-width: 767px)' })

  const { data: course, isLoading, alert } = useCourse(slug)

  const buildContent = (_course: Course) => {
    return (
      <Container mxAuto fluid className="p-4 pb-8">
        <div
          className={cn(
            'flex flex-col gap-4 mb-8',
            isMdScreen ? styles.container_mobile : styles.container_desktop
          )}
        >
          <Typography as="h1" className="text-4xl sml-2">
            {_course.title}
          </Typography>
          <Typography as="h2" className="text-md italic">
            {t('shared.informations.publishedBy', {
              user: _course.publisher?.displayName,
            })}
          </Typography>
          <Paragraph className="text-sm py-4 md:pr-1">
            {_course.content}
          </Paragraph>
        </div>
        {_course && _course.collections.length !== 0 ? (
          <CollectionList collections={_course.collections}></CollectionList>
        ) : null}
      </Container>
    )
  }

  if (alert) return <Redirect to="/not-found" />
  return (
    <Page variants={fadeOpacity} isLoading={isLoading} title={course?.title}>
      {course && buildContent(course)}
    </Page>
  )
}
