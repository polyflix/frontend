import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { Element } from '@core/models/element.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Link } from '@links/models/link.model'
import { useDeleteLinkMutation } from '@links/services/link.service'

type LinkListMenuMenuProps = {
  link: Element<Link>
}

export const LinkListMenuMenu = ({ link }: LinkListMenuMenuProps) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deleteLink] = useDeleteLinkMutation()

  const handleDelete = async () => {
    try {
      await deleteLink({ id: link?.id! }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Links)
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/links/${link.id}/update`}
      onDelete={handleDelete}
      publisherId={link?.user?.id!}
      type="links"
    />
  )
}
