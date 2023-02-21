/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@constants/endpoint.constant'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

import { VideoDescriptionReportModal } from '@videos/components/VideoDescription/VideoDescriptionReportModal/VideoDescriptionReportModal'
import { Video } from '@videos/models/video.model'
import { useDeleteVideoMutation } from '@shared/services/resources/videos/video.service'
import { polyflixRouter } from '@routes/index'

type Props = {
  video?: Video | null
}

export const VideoDescriptionMenu: React.FC<Props> = ({ video }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const history = useHistory()

  const [deleteVideo] = useDeleteVideoMutation()
  const [reportedVideo, setReportedVideo] = useState<Video>()

  const handleDelete = async () => {
    try {
      await deleteVideo({ slug: video?.slug! }).unwrap()
      history.push('/videos/explore')
      snackbarService.notify(CrudAction.DELETE, Endpoint.Videos)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  const handleReport = async () => {
    setReportedVideo(video ? video : undefined)
  }

  return (
    <>
      <CardMenu
        updateHref={polyflixRouter().studio.videos.update(video?.slug!!)}
        onDelete={handleDelete}
        onReport={handleReport}
        publisherId={video?.publisher?.id!}
        type="videos"
      />
      <VideoDescriptionReportModal
        onClose={() => setReportedVideo(undefined)}
        video={reportedVideo}
      />
    </>
  )
}
