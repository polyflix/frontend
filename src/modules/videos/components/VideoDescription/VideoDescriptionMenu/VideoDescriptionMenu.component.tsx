/* eslint-disable react/prop-types */
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Video } from '@videos/models/video.model'
import { useDeleteVideoMutation } from '@videos/services/video.service'

type Props = {
  video?: Video | null
}

export const VideoDescriptionMenu: React.FC<Props> = ({ video }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const history = useHistory()

  const [deleteVideo] = useDeleteVideoMutation()

  const handleDelete = async () => {
    try {
      await deleteVideo({ slug: video?.slug! }).unwrap()
      history.push('/videos/explore')
      snackbarService.notify(CrudAction.DELETE, Endpoint.Videos)
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/videos/${video?.slug}/update`}
      onDelete={handleDelete}
      publisherId={video?.publisher?.id!}
      type="videos"
    />
  )
}
