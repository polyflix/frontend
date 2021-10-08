import { PlusIcon } from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication/hooks'
import { Paginator } from '../../../common/components/Paginator/Paginator.component'
import { usePagination } from '../../../common/hooks'
import { PathListItem } from '../../../paths/components/PathsListItem.component'
import { usePaths } from '../../../paths/hooks/usePaths.hook'
import { Path } from '../../../paths/models'
import { PathService } from '../../../paths/services'
import { fadeOpacity, Typography } from '../../../ui'
import { Container } from '../../../ui/components/Container/Container.component'
import { Page } from '../../../ui/components/Page/Page.component'
import { Title } from '../../../ui/components/Typography/Title/Title.component'
import { useUser } from '../../hooks'

export const UserPathsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useTranslation()
  const pathService = useInjection<PathService>(PathService)
  const { setFinalPage, page, to, limit } = usePagination()
  const isOwnPage = user?.id === id

  const { data: fetchedUser, isLoading: isLoadingUser } = useUser({
    id,
  })

  const {
    data,
    isLoading: isLoadingPath,
    alert,
    refresh,
  } = usePaths(
    {
      publisherId: id,
      page,
      pageSize: limit,
    },
    setFinalPage
  )

  const onPathDelete = async (pathId: string) => {
    await pathService.deletePath(pathId)
    refresh()
  }

  if (alert && alert.type === 'not-found') return <Redirect to="/not-found" />
  return (
    <Page
      isLoading={isLoadingPath || isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t('userPaths.seo.ownTitle')
          : t('userPaths.seo.userTitle', { user: fetchedUser?.displayName })
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
              ? t('userPaths.seo.ownTitle')
              : t('userPaths.seo.userTitle', {
                  user: fetchedUser?.displayName,
                })}
          </Title>
          {isOwnPage && (
            <Typography
              as="span"
              className="flex items-center text-nx-red"
              overrideDefaultClasses
            >
              <Link to="/paths/create">
                <span className="inline-flex mx-2">
                  <PlusIcon className="w-6" /> {t('shared.common.actions.add')}{' '}
                  {t('pathManagement.path')}
                </span>
              </Link>
            </Typography>
          )}
        </div>
        {data && (
          <>
            {data.items.map((path: Path) => (
              <PathListItem
                key={path.id}
                onDelete={() => onPathDelete(path.id)}
                path={path}
                ownerItems={isOwnPage}
              ></PathListItem>
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
                  ? t('userPaths.list.ownNoPaths')
                  : t('userPaths.list.userNoPaths', {
                      user: fetchedUser?.displayName,
                    })}
              </div>
            )}
          </>
        )}
      </Container>
    </Page>
  )
}
