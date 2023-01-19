import { Icon as IconIconify } from "@iconify/react";
import React, { PropsWithChildren } from "react";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export const Icon: React.FC<PropsWithChildren<IconProps>> = ({
  name,
  color,
  size = 24,
}) => {
  return <IconIconify icon={name} width={size} height={size} color={color} />;
};
