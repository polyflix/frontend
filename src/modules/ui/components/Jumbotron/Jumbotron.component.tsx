import { PropsWithChildren } from "react";
import { WithClassname } from "../../../common";
import { GoBack } from "../../../common/components/Navigation/GoBack.component";
import { Title, Typography } from "../Typography";

type Props = WithClassname & {
  withGoBack?: boolean;
  title: string;
  content: string;
};

export const Jumbotron = ({
  withGoBack = false,
  title,
  content,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className="col-span-12 bg-darkgray text-nx-white rounded-md p-8">
      {withGoBack && <GoBack />}
      <Title className="mt-4">{title}</Title>
      <Typography
        as="p"
        overrideDefaultClasses
        className={`m${
          children ? "y" : "t"
        }-8 leading-6 text-lightgray text-sm md:text-base`}
      >
        {content}
      </Typography>
      {children && <div className="flex">{children}</div>}
    </div>
  );
};
