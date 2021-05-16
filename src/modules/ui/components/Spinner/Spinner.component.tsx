import { motion } from "framer-motion";
import { WithClassname, WithMotion } from "../../../common/types/props.type";
import { cn } from "../../../common/utils/classes.util";
import { fadeOpacity } from "../../animations/fadeOpacity";

type Props = WithClassname &
  WithMotion & {
    /** The spinner height */
    height?: number;
    /** The spinner width */
    width?: number;
    /** If true, the spinner will be displayed in a page */
    page?: boolean;
  };

const SpinnerSvg: React.FC<Props> = ({ height, width, ...rest }) => (
  <motion.svg
    {...rest}
    width={height}
    height={width}
    viewBox={`0 0 38 38`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
        <stop stopColor="currentColor" stopOpacity="0" offset="0%" />
        <stop stopColor="currentcolor" stopOpacity=".631" offset="63.146%" />
        <stop stopColor="currentColor" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)">
        <path
          d="M36 18c0-9.94-8.06-18-18-18"
          id="Oval-2"
          stroke="url(#a)"
          strokeWidth="2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
        <circle fill="currentColor" cx="36" cy="18" r="1">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </g>
  </motion.svg>
);

export const Spinner: React.FC<Props> = ({
  height = 38,
  width = 38,
  page = false,
  style,
  className = "",
  ...rest
}) => {
  if (page) {
    return (
      <motion.div
        variants={fadeOpacity}
        style={style}
        className={cn(
          "text-nx-red flex items-center justify-center",
          className
        )}
      >
        <SpinnerSvg width={60} height={60} {...rest} />
      </motion.div>
    );
  }
  return <SpinnerSvg width={width} height={height} {...rest} />;
};
