import { Disclosure as HUIDisclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { PropsWithChildren } from "react";
import { WithClassname, WithMotion } from "../../../common";
import { fadeInDown } from "../../animations";
import { Title } from "../Typography";

type Props = WithClassname & WithMotion & { title?: string };

export const Disclosure: React.FC<PropsWithChildren<Props>> = ({
  title = "",
  children,
  ...rest
}) => {
  return (
    <HUIDisclosure {...rest}>
      {({ open }) => (
        <>
          <HUIDisclosure.Button className="flex justify-between items-center bg-nx-dark bg-opacity-40 hover:bg-opacity-70 w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none">
            <Title variants={fadeInDown}>{title}</Title>
            <ChevronUpIcon
              className={`${
                open ? "transform rotate-180" : ""
              } w-5 h-5 text-nx-red`}
            />
          </HUIDisclosure.Button>
          <HUIDisclosure.Panel className="px-4 pt-4 pb-2 text-sm">
            {children}
          </HUIDisclosure.Panel>
        </>
      )}
    </HUIDisclosure>
  );
};
