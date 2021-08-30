import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Container, FilledButton, Page, Paragraph, Typography } from "../../ui";

export const ForbiddenPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Page withNavbar={false} title={t("forbidden.content.title")}>
      <Container mxAuto>
        <div className="flex flex-col items-center justify-center">
          <Typography
            as="h1"
            className="text-nx-red text-6xl"
            bold
            overrideDefaultClasses
          >
            403
          </Typography>

          <Typography as="h1" className="text-3xl">
            {t("forbidden.content.title")} !
          </Typography>

          <Paragraph className="my-4">
            {t("forbidden.content.description")}
          </Paragraph>

          <FilledButton onClick={() => history.goBack()} as="button">
            {t("forbidden.content.goback")}
          </FilledButton>
        </div>
      </Container>
    </Page>
  );
};
