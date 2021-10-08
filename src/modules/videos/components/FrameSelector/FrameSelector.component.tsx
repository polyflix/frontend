import { UploadIcon } from '@heroicons/react/outline'
import {
  Player,
  Video as Provider,
  Ui,
  ClickToPlay,
  Controls,
  Control,
  ScrubberControl,
  LoadingScreen,
  Tooltip,
} from '@vime/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import Placeholder from '../../../../assets/images/videoPlaceholder.png'
import { WithMotion } from '../../../common'

type Props = WithMotion & {
  getFrame: () => void
  videoPreview: string
  playerRef: any
}

export const FrameSelector: React.FC<Props> = ({
  getFrame,
  videoPreview,
  playerRef,
  ...rest
}) => {
  const { t } = useTranslation()

  return (
    <motion.div {...rest}>
      <Player ref={playerRef} id="vm-player">
        <Provider>
          <source data-src={videoPreview} type="video/mp4" />
        </Provider>
        <Ui>
          <Controls>
            <ScrubberControl />
          </Controls>
          <Controls pin="topRight">
            <Control label="upload" onClick={getFrame}>
              <UploadIcon className="w-6 h-6 m-1" />
              <Tooltip position="bottom" direction="right">
                {t('videoManagement.actions.getThumbnail')}
              </Tooltip>
            </Control>
          </Controls>
          <ClickToPlay />
          <LoadingScreen hideDots>
            <img
              src={Placeholder}
              alt=""
              className="rounded-md object-cover h-full"
            />
          </LoadingScreen>
        </Ui>
      </Player>
    </motion.div>
  )
}
