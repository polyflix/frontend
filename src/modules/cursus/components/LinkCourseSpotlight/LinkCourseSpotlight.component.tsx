import { CircularProgress, Stack, Pagination } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'

import { Visibility } from '@core/models/content.model'

import { InlineCourseCard } from '@courses/components/InlineCourseCard/InlineCourseCard.component'
import { Course } from '@courses/models/course.model'
import { useGetCoursesQuery } from '@courses/services/course.service'
import { CoursesFilters } from '@courses/types/filters.type'

type Props = {
  onSelectCourse: (course: Course) => void
}

export const LinkCourseSpotlight: React.FC<Props> = ({ onSelectCourse }) => {
  // const [query, setQuery] = useState('')
  // const [searchValue, setSearchValue] = useState('')

  const [filters, setFilters] = useState<CoursesFilters>({
    order: 'createdAt',
    page: 1,
    pageSize: 5,
    draft: false,
    visibility: Visibility.PUBLIC,
  })
  // We put a threshold, so when we type we don't search for EVERY characters
  // we wait a small time to know if the user ended typing or not
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => setQuery(searchValue), 500)
  //   return () => clearTimeout(timeoutId)
  // }, [searchValue])

  const { data: courses, isLoading } = useGetCoursesQuery({
    ...filters,
  })
  // This way, we make the user understand the search is pending when
  // request is sent or when the state update is in timeout
  // const isLoading = isRequestPending || searchValue !== query
  let totalPage = Math.ceil((courses?.total ?? 1) / (filters.pageSize ?? 1))

  return (
    <Box>
      <Stack>
        {isLoading && <CircularProgress sx={{ marginX: 'auto', marginY: 2 }} />}
      </Stack>
      {courses?.data?.map((course) => (
        <div onClick={() => onSelectCourse(course)} key={course.id}>
          <InlineCourseCard course={course} />
        </div>
      ))}
      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={totalPage < 1 ? 1 : totalPage}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
