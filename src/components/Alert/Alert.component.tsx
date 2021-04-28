import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { motion } from "framer-motion";
import React, { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../types/props.type";
import { cn } from "../../utils/classes.util";
import Typography from "../Typography/Typography.component";

export type AlertType = "success" | "error" | "warning" | "info";

type AlertMetadata = {
  icon: any;
  classes: string;
};

type Props = WithClassname &
  WithMotion & {
    /** The type of the alert to display */
    type?: AlertType;
  };

const alertMetadataFactory = (icon: any, classes: string): AlertMetadata => ({
  icon,
  classes,
});

const getAlertMetadata = (type: AlertType): AlertMetadata => {
  switch (type) {
    case "error":
      return alertMetadataFactory(ExclamationCircleIcon, "text-nx-red");
    case "success":
      return alertMetadataFactory(CheckCircleIcon, "text-green-500");
    case "warning":
      return alertMetadataFactory(ExclamationIcon, "text-yellow-500");
    case "info":
      return alertMetadataFactory(InformationCircleIcon, "text-blue-500");
  }
};

/**
 * A simple component to display an alert.
 * It renders a text prefixed by an icon.
 */
const Alert: React.FC<PropsWithChildren<Props>> = ({
  type = "error",
  className = "",
  children,
  ...rest
}) => {
  const { icon: Icon, classes } = getAlertMetadata(type);
  return (
    <motion.div
      {...rest}
      className={cn(className, "flex items-center", classes)}
    >
      <Icon className="w-7" />
      <Typography as="span" className="text-sm ml-2">
        {children}
      </Typography>
    </motion.div>
  );
};

export default Alert;
