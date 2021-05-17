import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { PaginationMode } from "../../types/pagination.type";
import { WithClassname } from "../../types/props.type";
import { cn } from "../../utils/classes.util";

type Props = WithClassname & {
  /** Total number of pages */
  total: number;
  /** The current page */
  page: number;
  /** Callback called when the page change */
  onPageChanged: (mode: PaginationMode) => void;
};

/**
 * A component which display a pagination.
 */
export const Paginator: React.FC<Props> = ({
  total,
  page,
  onPageChanged,
  className = "",
}) => {
  return (
    <Typography
      as="span"
      className={cn("flex items-center cursor-pointer", className)}
    >
      <ChevronDoubleLeftIcon
        onClick={() => onPageChanged("first")}
        className="w-6 text-nx-red"
      />
      <ChevronLeftIcon
        onClick={() => onPageChanged("previous")}
        className="w-6 text-nx-red"
      />
      <span>
        {page} / {total}
      </span>
      <ChevronRightIcon
        onClick={() => onPageChanged("next")}
        className="w-6 text-nx-red"
      />
      <ChevronDoubleRightIcon
        onClick={() => onPageChanged("last")}
        className="w-6 text-nx-red"
      />
    </Typography>
  );
};
