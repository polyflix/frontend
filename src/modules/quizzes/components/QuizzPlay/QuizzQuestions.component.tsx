import { capitalize } from "lodash";
import { useTranslation } from "react-i18next";
import { cn } from "../../../common";
import { Button, FilledButton, Paragraph, Title } from "../../../ui";
import { usePlayQuizz } from "../../hooks/usePlayQuizz.hook";
import { PlayComponentProps, PlayQuizzStep } from "../../types/play-quizz.type";

export const QuizzQuestions = ({ quizz, playService }: PlayComponentProps) => {
  const { t } = useTranslation("play-quizz");
  const { questionIdx, answers } = usePlayQuizz();

  const buildQuestionsRow = (): JSX.Element[] => {
    let items: JSX.Element[] = [];

    for (let i = 0; i < quizz.questions.length; i++) {
      const isActive = i === questionIdx;
      const item = (
        <button
          key={i}
          onClick={() => playService.setQuestionIndex(i)}
          className={cn(
            "border border-nx-red w-8 h-8 text-sm flex items-center justify-center rounded-md m-1 hover:bg-nx-red hover:text-nx-white transition-all outline-none focus:outline-none",
            isActive ? "bg-nx-red text-nx-white" : "text-nx-red"
          )}
        >
          {i + 1}
        </button>
      );
      items.push(item);
    }

    return items;
  };

  const question = quizz.getQuestion(questionIdx);
  const isFirstQuestion = questionIdx === 0;
  const isLastQuestion = questionIdx === quizz.questions.length - 1;

  return (
    <div className="w-10/12 mx-auto grid grid-cols-12 gap-4">
      <div className="col-span-2">
        <div className="rounded-md p-2 bg-darkgray flex flex-wrap">
          {buildQuestionsRow()}
        </div>
      </div>

      <div className="rounded-md bg-darkgray p-8 col-span-10">
        <Title overrideDefaultClasses className="text-2xl font-bold">
          Question n°{questionIdx + 1}
        </Title>
        <Paragraph className="my-8">{question.label}</Paragraph>
        <div className="grid gap-8 grid-cols-2">
          {question.alternatives.map(({ label, id }) => {
            // check if the actual alternative was selected previously
            const isSelected = (answers[question.id] || []).includes(id);
            return (
              <div
                onClick={() => playService.setAnswer(question.id, id)}
                className={cn(
                  "px-4 cursor-pointer py-7 rounded-md border border-lightgray border-opacity-40 transform hover:scale-105 transition-all",
                  isSelected && "bg-yellow-600"
                )}
                key={id}
              >
                {capitalize(label)}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-8">
          {isFirstQuestion ? (
            <div />
          ) : (
            <Button
              as="button"
              className="bg-black bg-opacity-50 hover:bg-opacity-80 transition-all outline-none focus:outline-none"
              onClick={() => playService.setQuestionIndex(questionIdx - 1)}
            >
              {t("questions.previous")}
            </Button>
          )}
          <FilledButton
            as="button"
            onClick={() =>
              isLastQuestion
                ? playService.setStep(PlayQuizzStep.Recap)
                : playService.setQuestionIndex(questionIdx + 1)
            }
          >
            {isLastQuestion ? t("questions.terminate") : t("questions.next")}
          </FilledButton>
        </div>
      </div>
    </div>
  );
};
