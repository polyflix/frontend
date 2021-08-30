import { CheckCircleIcon } from "@heroicons/react/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/solid";
import { capitalize } from "lodash";
import { useTranslation } from "react-i18next";
import { cn } from "../../../common";
import { FilledButton, Paragraph, Title, Typography } from "../../../ui";
import { usePlayQuizz } from "../../hooks/usePlayQuizz.hook";
import { PlayComponentProps, PlayQuizzStep } from "../../types/play-quizz.type";

export const QuizzRecap = ({ quizz, playService }: PlayComponentProps) => {
  const { answers, isSubmitting } = usePlayQuizz();
  const { t } = useTranslation("play-quizz");

  return (
    <div className="w-10/12 mx-auto py-8">
      <div className="p-8 bg-darkgray rounded-md">
        <Title>{t("recap.title")}</Title>
        <Paragraph className="mt-4">{t("recap.description")}</Paragraph>
      </div>
      {quizz.questions.map((question, idx) => {
        return (
          <div key={idx} className="p-8 my-4 bg-darkgray rounded-md">
            <Typography as="h5" bold>
              {idx + 1}. {question.label}
            </Typography>
            <ul className="my-4">
              {question.alternatives.map(({ label, id }, idx) => {
                const isSelected = (answers[question.id] || []).includes(id);
                return (
                  <li
                    className={cn(
                      "my-2 flex",
                      isSelected ? "text-yellow-600" : "text-nx-red"
                    )}
                    key={idx}
                  >
                    {isSelected ? (
                      <CheckCircleIconSolid className="w-5 mr-2" />
                    ) : (
                      <CheckCircleIcon className="w-5 mr-2" />
                    )}
                    <Typography
                      className={cn(
                        isSelected
                          ? "text-nx-white"
                          : "text-nx-gray text-opacity-40",
                        "text-sm"
                      )}
                      overrideDefaultClasses
                      as="span"
                    >
                      {capitalize(label)}
                    </Typography>
                  </li>
                );
              })}
            </ul>
            <button
              className="text-sm text-nx-red hover:underline"
              onClick={() => {
                playService.setQuestionIndex(idx);
                playService.setStep(PlayQuizzStep.Questions);
              }}
            >
              {t("recap.updateAnswers")}
            </button>
          </div>
        );
      })}
      <div className="px-8 py-4 bg-darkgray rounded-md flex items-center justify-between">
        <Paragraph className="text-sm mb-4" overrideDefaultClasses>
          {t("recap.validationMessage")}
        </Paragraph>
        <FilledButton
          disabled={isSubmitting}
          className="flex-shrink-0"
          as="button"
          onClick={async () => {
            await playService.submit(quizz.id, answers);
            playService.setStep(PlayQuizzStep.End);
          }}
        >
          {t("recap.validate")}
        </FilledButton>
      </div>
    </div>
  );
};
