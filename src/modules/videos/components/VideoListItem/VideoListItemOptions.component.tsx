import React, { Fragment } from "react";
import { Typography } from "../../../ui";
import {
  DotsVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { Menu, Transition } from "@headlessui/react";
import { ActionLink } from "../../../common/components/ActionLink.component";
import { ChartPieIcon } from "@heroicons/react/solid";
type Props = {
  onTriggerDelete: () => void;
  editLink: string;
  statsLink?: string;
};
export const VideoListItemOptions: React.FC<Props> = ({
  onTriggerDelete,
  editLink,
  statsLink,
}) => {
  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button>
            <Typography
              as="span"
              className={
                "flex text-sm md:text-base hover:underline cursor-pointer hover:text-nx-red"
              }
            >
              <DotsVerticalIcon className="w-4 md:w-5 mr-2 text-nx-red" />
            </Typography>
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute border-nx-red border-2 right-0 w-56 mt-2 origin-top-right bg-black divide-y divide-nx-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="px-1 py-1">
                <Menu.Item>
                  <ActionLink
                    Icon={TrashIcon}
                    text={t("shared.common.actions.delete")}
                    onClick={onTriggerDelete}
                    className={
                      "text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm"
                    }
                  />
                </Menu.Item>
                <Menu.Item>
                  <ActionLink
                    Icon={PencilIcon}
                    to={editLink}
                    text={t("shared.common.actions.edit")}
                    className={
                      "text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm"
                    }
                  />
                </Menu.Item>
                {statsLink && (
                  <Menu.Item>
                    <ActionLink
                      Icon={ChartPieIcon}
                      to={statsLink}
                      text={"Stats"}
                      className={
                        "text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm"
                      }
                    />
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
