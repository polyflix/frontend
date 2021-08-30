import { PlusIcon } from '@heroicons/react/outline';
import { useInjection } from '@polyflix/di';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { usePagination } from '../../../common/hooks';
import { useCourses } from '../../../courses/hooks';
import { CourseService } from '../../../courses/services';
import { fadeOpacity, Typography } from '../../../ui';
import { Container } from '../../../ui/components/Container/Container.component';
import { Page } from '../../../ui/components/Page/Page.component';
import { Title } from '../../../ui/components/Typography/Title/Title.component';
import { Course } from '../../../courses/models';
import { Paginator } from '../../../common/components/Paginator/Paginator.component';
import { CourseListItem } from '../../../courses/components';
import { useAuth } from '../../../authentication/hooks';
import { useUser } from '../../hooks';

export const UserCoursesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const courseService = useInjection<CourseService>(CourseService);
  const {
    setFinalPage, page, to, limit,
  } = usePagination();
  const isOwnPage = user?.id === id;

  const { data: fetchedUser, isLoading: isLoadingUser } = useUser({
    id,
  });

  const {
    data,
    isLoading: isLoadingCourse,
    alert,
    refresh,
  } = useCourses(
    {
      publisherId: id,
      page,
      pageSize: limit,
    },
    setFinalPage,
  );
  const onCourseDelete = async (id: string) => {
    await courseService.deleteCourse(id);
    refresh();
  };
  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />;
  return (
    <Page
      isLoading={isLoadingCourse || isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t('userCourses.seo.ownTitle')
          : t('userCourses.seo.userTitle', { user: fetchedUser?.displayName })
      }
    >
      <Container mxAuto className="px-5 flex flex-col">
        {alert && alert.type === 'error' && (
          <div className="bg-nx-red-dark w-1/4 text-white font-extrabold rounded flex text-center justify-center self-center">
            {`${alert.message}`}
          </div>
        )}
        <div className="flex items-center justify-between">
          <Title className="my-5">
            {isOwnPage
              ? t('userCourses.seo.ownTitle')
              : t('userCourses.seo.userTitle', {
                user: fetchedUser?.displayName,
              })}
          </Title>
          {isOwnPage && (
            <Typography
              as="span"
              className="flex items-center text-nx-red"
              overrideDefaultClasses
            >
              <Link to="/courses/create">
                <span className="inline-flex mx-2">
                  <PlusIcon className="w-6" />
                  {' '}
                  {t('shared.common.actions.add')}
                  {' '}
                  {t('courseManagement.course')}
                </span>
              </Link>
            </Typography>
          )}
        </div>
        {data && (
          <>
            {data.items.map((course: Course) => (
              <CourseListItem
                key={course.id}
                onDelete={() => onCourseDelete(course.id)}
                course={course}
                ownerItems={isOwnPage}
              />
            ))}
            {data.items.length > 0 ? (
              <Paginator
                className="py-5 justify-end"
                page={page}
                onPageChanged={to}
                total={Math.floor(data.totalCount / data.items.length)}
              />
            ) : (
              <div className="text-white">
                {' '}
                {isOwnPage
                  ? t('userCourses.list.ownNoCourses')
                  : t('userCourses.list.userNoCourses', {
                    user: fetchedUser?.displayName,
                  })}
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  );
};
