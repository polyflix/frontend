import {
  BookOpenIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { HTMLProps, PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { cn } from "../../../../common";

type Props = {
  type: "edit" | "info" | "update" | "delete" | "create";
  font?: "xs" | "sm" | "base" | "lg";
  link?: string;
  textOverride?: string;
  customIcon?: any;
} & HTMLProps<HTMLButtonElement>;

export const CrudButton = ({
  type,
  link,
  textOverride,
  font = "base",
  customIcon,
  ...rest
}: PropsWithChildren<Props>) => {
  const { t } = useTranslation("components");

  const getColor = (): string => {
    switch (type) {
      case "edit":
        return "text-blue-500";
      case "delete":
        return "text-nx-red";
      case "info":
        return "text-green-500";
      default:
        return "text-nx-white";
    }
  };

  const getIcon = (): ReactNode => {
    let Icon;
    const iconClasses = `w-4 ${getColor()}`;
    if (customIcon) Icon = customIcon;
    else {
      switch (type) {
        case "edit":
          Icon = PencilAltIcon;
          break;
        case "delete":
          Icon = TrashIcon;
          break;
        default:
          Icon = BookOpenIcon;
          break;
      }
    }
    return <Icon className={iconClasses} />;
  };

  const getComponent = ({ onClick, ...props }: any) => {
    return (
      <button
        className={cn(`text-${font}`, "focus:outline-none")}
        {...(onClick && {
          onClick: (e) => {
            e.preventDefault();
            onClick();
          },
        })}
        {...props}
      >
        <span
          className={cn(
            "flex items-center transition-all",
            `hover:${getColor()}`
          )}
        >
          {getIcon()}
          <span className="mr-2" />
          {textOverride || t(`crud-button.${type}`)}
        </span>
      </button>
    );
  };

  return link ? (
    <Link className="flex items-center" to={link}>
      {getComponent(rest)}
    </Link>
  ) : (
    getComponent(rest)
  );
};
