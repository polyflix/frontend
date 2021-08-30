import { isNull, isUndefined } from "lodash";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "../../common/hooks/useQuery";
import { Container, fadeOpacity, Page } from "../../ui";
import { QuizzForm } from "../components/QuizzForm/QuizzForm.component";
import { QuizzImport } from "../components/QuizzImport/QuizzImport.component";
import { useQuizz } from "../hooks/useQuizz.hook";

export const CreateUpdateQuizzPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("resources");

  // Get the source from ?source= in the URI
  const source = useQuery("source");

  const { data: quizz, isLoading } = useQuizz(id, {
    join: ["questions", "questions.alternatives"],
  });

  // If there is an id and it is not null or undefined, we are in update mode.
  const isUpdate = !isUndefined(id) && !isNull(id);
  const isImport = source === "import";

  return (
    <Page
      variants={fadeOpacity}
      title={t(`quizzes.seo.createUpdate.${isUpdate ? "update" : "create"}`, {
        quizz: quizz?.name,
      })}
      isLoading={isUpdate ? isLoading : false}
    >
      <Container mxAuto className="py-5">
        {isImport && <QuizzImport />}
        {!isImport && <QuizzForm isUpdate={isUpdate} quizz={quizz} />}
      </Container>
    </Page>
  );
};
