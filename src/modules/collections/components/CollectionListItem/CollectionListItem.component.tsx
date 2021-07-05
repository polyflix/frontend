import {
  EyeIcon,
  EyeOffIcon,
  GlobeIcon,
  InformationCircleIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { cn } from "../../../common/utils/classes.util";
import { Alert } from "../../../ui/components/Alert/Alert.component";
import { Image } from "../../../ui/components/Image/Image.component";
import { Notification } from "../../../ui/components/Notification/Notification.component";
import { Paragraph } from "../../../ui/components/Typography/Paragraph/Paragraph.component";
import { Typography } from "../../../ui/components/Typography/Typography.component";
import { Collection } from "../../models/collections.model";

type Props = {
  collection: Collection;
  onDelete?: () => void;
  ownerItems?: boolean;
  links?: boolean;
};

export const CollectionListItem: React.FC<Props> = () => <p color="white"> Hello World </p>
