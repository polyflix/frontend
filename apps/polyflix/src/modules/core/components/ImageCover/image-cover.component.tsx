import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'

type ImageCoverProps = {
  ratio: number
  src: string
  alt?: string
}

export const ImageCover = ({ ratio, src, alt }: ImageCoverProps) => {
  return (
    <AspectRatioBox
      ratio={ratio}
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AspectRatioBox>
  )
}
