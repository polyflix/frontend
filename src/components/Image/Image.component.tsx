import { motion } from "framer-motion";
import { WithClassname, WithMotion } from "../../types/props.type";

type Props = WithClassname &
  WithMotion & {
    /** The source of the image */
    src: string;
    /** The alternative text if the image can't be loaded */
    alt: string;
  };

/**
 * Simple React component to render an image.
 */
const Image: React.FC<Props> = ({ ...props }) => {
  return <motion.img {...props} />;
};

export default Image;
