import FilledButton from "@ui/components/Buttons/FilledButton/FilledButton.component";
import Page from "@ui/components/Page/Page.component";
import Paragraph from "@ui/components/Typography/Paragraph/Paragraph.component";
import Typography from "@ui/components/Typography/Typography.component";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <Page
      title="Page not found"
      className="flex items-center justify-center flex-col"
    >
      <div className="flex flex-col items-center justify-center">
        <Typography
          as="h1"
          className="text-nx-red text-6xl"
          bold
          overrideDefaultClasses
        >
          404
        </Typography>

        <Typography as="h1" className="text-3xl">
          Oops, page not found !
        </Typography>

        <Paragraph className="my-4">
          We can't find the page you want to access. The ressource has been
          moved or deleted.{" "}
        </Paragraph>

        <Link to="/">
          <FilledButton as="button">Go home</FilledButton>
        </Link>
      </div>
    </Page>
  );
};

export default NotFoundPage;
