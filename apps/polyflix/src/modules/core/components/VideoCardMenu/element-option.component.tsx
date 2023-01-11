import { Video } from '@videos/models/video.model'
import { CardMenu } from '../CardMenu/CardMenu.component'

type VideoCardMenuProps = {
  video: Video
}

export const VideoCardMenu = ({ video }: VideoCardMenuProps) => {
  const handleDelete = async () => {}

  return (
    <CardMenu
      updateHref={`/videos/${video.slug}/update`}
      onDelete={handleDelete}
      publisherId={video.publisher?.id}
      type="videos"
    />
  )
}
