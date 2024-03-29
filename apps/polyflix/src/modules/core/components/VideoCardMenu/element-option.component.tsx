import { polyflixRouter } from '@routes/index'
import { Video } from '@videos/models/video.model'
import { CardMenu } from '../CardMenu/CardMenu.component'

type VideoCardMenuProps = {
  video: Video
}

export const VideoCardMenu = ({ video }: VideoCardMenuProps) => {
  const handleDelete = async () => {}

  return (
    <CardMenu
      updateHref={polyflixRouter().studio.videos.update(video.id)}
      onDelete={handleDelete}
      publisherId={video.publisher?.id}
      type="videos"
    />
  )
}
