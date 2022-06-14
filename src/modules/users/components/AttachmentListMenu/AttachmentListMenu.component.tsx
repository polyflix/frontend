import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { useDeleteLinkMutation } from '@links/services/link.service'

import { Attachment } from '@attachments/models/attachment.model'

type AttachmentListMenuProps = {
  attachment: Attachment
}

export const AttachmentListMenu = ({ attachment }: AttachmentListMenuProps) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deleteLink] = useDeleteLinkMutation()

  const handleDelete = async () => {
    try {
      await deleteLink({ id: attachment.id }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Links)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/users/profile/attachments/${attachment.id}/update`}
      onDelete={handleDelete}
      type="links"
    />
  )
}
