import React from 'react';
import { applyBackgroundImage } from '../../../common/utils/classes.util';
import { Image } from '../../../ui/components/Image/Image.component';
import { NoData } from '../../../ui/components/NoData/NoData.component';
import { Paragraph } from '../../../ui/components/Typography/Paragraph/Paragraph.component';
import { Typography } from '../../../ui/components/Typography/Typography.component';
import { Video } from '../../models/video.model';
import { VideoButtons } from '../VideoButtons/VideoButton.component';

type Props = {
  video: Video
}

export const VideoTile: React.FC<Props> = ({ video }) => (video ? (
  <div
    style={applyBackgroundImage(video.thumbnail)}
    className="w-full h-auto relative my-2 lg:my-8"
  >
    <Overlay />
    <div className="py-2 lg:py-16 h-full w-full z-10 px-5">
      <div className="grid h-full items-center relative grid-cols-2 w-full md:w-10/12 lg:w-8/12 mx-auto gap-5">
        <div className="hidden col-span-1 md:block">
          <div className="p-5">
            <Image
              src={video.thumbnail}
              alt={`${video.title} thumbnail`}
              className="rounded-md"
            />
          </div>
        </div>
        <div className="col-span-2 py-5 md:py-0 md:col-span-1 flex flex-col justify-center">
          <Typography bold className="text-lg md:text-2xl" as="h1">
            {video.title}
          </Typography>
          <Paragraph className="my-3">{video.shortDescription}</Paragraph>
          <VideoButtons video={video} />
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-center">
    <NoData />
  </div>
));

const Overlay: React.FC = () => (
  <div className="bg-black bg-opacity-70 w-full h-full absolute" />
);
