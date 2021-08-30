import {
  Player,
  Video as Provider,
  Ui,
  ClickToPlay,
  Controls,
  Control,
  Tooltip,
  ScrubberControl,
  ControlSpacer,
  LoadingScreen,
} from "@vime/react";
import {
  UploadIcon,
  InformationCircleIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { WithMotion } from "../../../common";
import { motion } from "framer-motion";

type Props = WithMotion & {
  getFrame: () => void;
  videoPreview: string;
  playerRef: any;
};

export const FrameSelector: React.FC<Props> = ({
  getFrame,
  videoPreview,
  playerRef,
  ...rest
}) => {
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
            </Control>
            {/* <ControlSpacer />
					<Control
					label="information"
					>
					<InformationCircleIcon className="w-6 h-6 m-1" />
					<Tooltip position="bottom" direction="left">Description de la fonctionnnalité</Tooltip>
					</Control> */}
          </Controls>
          <ClickToPlay />
          <LoadingScreen hideDots>
            <img
              src="https://i.stack.imgur.com/y9DpT.jpg"
              alt=""
              className="rounded-md object-cover h-full"
            />
          </LoadingScreen>
        </Ui>
      </Player>
    </motion.div>
  );
};
