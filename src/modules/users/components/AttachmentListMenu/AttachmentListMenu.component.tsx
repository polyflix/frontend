import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Attachment } from '@attachments/models/attachment.model'
import { useDeleteAttachmentMutation } from '@attachments/services/attachment.service'

type AttachmentListMenuProps = {
  attachment: Attachment
  onDelete: () => void
}

export const AttachmentListMenu = ({
  attachment,
  onDelete,
}: AttachmentListMenuProps) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deleteAttachment] = useDeleteAttachmentMutation()

  const handleDelete = async () => {
    try {
      await deleteAttachment({ id: attachment.id }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Attachments)
      onDelete()
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/users/profile/attachments/update/${attachment.id}`}
      onDelete={handleDelete}
      type="attachments"
    />
  )
}
