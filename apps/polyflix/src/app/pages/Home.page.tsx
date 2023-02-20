import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'
import {
  APP_BAR_DESKTOP,
  APP_BAR_MOBILE,
} from '@layouts/Dashboard/Dashboard.style'
import { Visibility } from '@types_/resources/content.type'

import { useGetVideosQuery } from '@videos/services/video.service'

import 'swiper/css'
import 'swiper/css/pagination'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { PageSection } from '@core/components/PageSection/page-section.component'
import { Jumbotron } from '@core/components/Jumbotron/jumbotron.component'
import { ElementsRow } from '@core/components/ElementsRow/elements-row.component'
import { CourseCard } from '@core/components/CourseCard/course-card.component'
import { VideoCard } from '@core/components/VideoCard/video-card.component'
import { Footer } from '@core/components/Footer/footer.component'
import { buildQueryParams } from '@core/utils/http-utils'
import { Course } from '@types_/resources/course.type'

const PopularCoursesSection = () => {
  const filters = {
    draft: false,
  }
  const { data, isLoading, isError } = useGetCoursesQuery({
    page: 1,
    pageSize: 5,
    ...filters,
  })
  const seeMoreRoute = `courses/explore?${buildQueryParams(filters)}`

  const { t } = useTranslation('home')

  return (
    <PageSection sx={{ pt: 10 }}>
      <ElementsRow
        title={t('sections.titles.popularCourse')}
        seeMoreRoute={seeMoreRoute}
        icon="gg:align-left"
        loading={isLoading}
        hasNoData={isEmpty(data?.data)}
        isError={isError}
      >
        {(data?.data || []).map((course: Course, index: number) => (
          <CourseCard key={index} course={course} />
        ))}
      </ElementsRow>
    </PageSection>
  )
}
const LastVideosSection = () => {
  const filters = {
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-createdAt',
  }
  const { data, isLoading, isError } = useGetVideosQuery({
    page: 1,
    pageSize: 5,
    ...filters,
  })

  const seeMoreRoute = `videos/explore?${buildQueryParams(filters)}`

  const { t } = useTranslation('home')

  return (
    <PageSection sx={{ pt: 10 }}>
      <ElementsRow
        title={t('sections.titles.lastVideos')}
        seeMoreRoute={seeMoreRoute}
        icon="eva:play-circle-outline"
        loading={isLoading}
        hasNoData={isEmpty(data?.items)}
        isError={isError}
      >
        {(data?.items || []).map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </ElementsRow>
    </PageSection>
  )
}
const PopularVideosSection = () => {
  const filters = {
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-views',
  }
  const { data, isLoading, isError } = useGetVideosQuery({
    page: 1,
    pageSize: 5,
  })

  const seeMoreRoute = `videos/explore?${buildQueryParams(filters)}`

  const { t } = useTranslation('home')

  return (
    <PageSection sx={{ pt: 10 }}>
      <ElementsRow
        title={t('sections.titles.popularVideos')}
        seeMoreRoute={seeMoreRoute}
        icon="eva:play-circle-outline"
        loading={isLoading}
        hasNoData={isEmpty(data?.items)}
        isError={isError}
      >
        {(data?.items || []).map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </ElementsRow>
    </PageSection>
  )
}
const MostLikedVideoSection = () => {
  const filters = {
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-likes',
  }

  const { data, isLoading, isError } = useGetVideosQuery({
    page: 1,
    pageSize: 5,
  })

  const seeMoreRoute = `videos/explore?${buildQueryParams(filters)}`

  const { t } = useTranslation('home')

  return (
    <PageSection sx={{ pt: 10 }}>
      <ElementsRow
        title={t('sections.titles.mostLikedVideos')}
        seeMoreRoute={seeMoreRoute}
        icon="eva:play-circle-outline"
        loading={isLoading}
        hasNoData={isEmpty(data?.items)}
        isError={isError}
      >
        {(data?.items || []).map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </ElementsRow>
    </PageSection>
  )
}

export const HomePage = () => {
  const { t } = useTranslation('home')
  return (
    <Page
      title={t('page.title')}
      maxWidth={false}
      disableGutters
      sx={{
        pt: 0,
      }}
    >
      <PageSection
        innerProps={{
          alignItems: 'center',
          spacing: 2,
        }}
        sx={{
          backgroundColor: 'bg',
          pt: {
            xs: `${APP_BAR_MOBILE + 16}px`,
            lg: `${APP_BAR_DESKTOP}px`,
          },
        }}
      >
        <Jumbotron />
      </PageSection>

      <PopularCoursesSection />
      <LastVideosSection />
      <PopularVideosSection />
      <MostLikedVideoSection />
      <Footer />
    </Page>
  )
}
