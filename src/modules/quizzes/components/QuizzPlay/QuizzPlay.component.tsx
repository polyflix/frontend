import { useInjection } from "@polyflix/di";
import { Pagination } from "../../../common/types/crud.type";
import { usePlayQuizz } from "../../hooks/usePlayQuizz.hook";
import { Attempt } from "../../models/attempt.model";
import { Quizz } from "../../models/quizz.model";
import { PlayQuizzService } from "../../services/play.service";
import { PlayComponentProps, PlayQuizzStep } from "../../types/play-quizz.type";
import { QuizzEnd } from "./QuizzEnd.component";
import { QuizzNoMoreAttempts } from "./QuizzNoMoreAttempts.component";
import { QuizzOnboard } from "./QuizzOnboard.component";
import { QuizzQuestions } from "./QuizzQuestions.component";
import { QuizzRecap } from "./QuizzRecap.component";

type Props = {
  quizz: Quizz;
  attempts: Pagination<Attempt>;
};

const { End, Onboard, Questions, Recap } = PlayQuizzStep;

export const QuizzPlay = ({ quizz, attempts }: Props) => {
  const playService = useInjection<PlayQuizzService>(PlayQuizzService);

  // We need to get the actual step from our Redux state to display the good component.
  const { step } = usePlayQuizz();

  // An object of common properties between each of our play components.
  const commonProps: PlayComponentProps = {
    quizz,
    playService,
  };

  // Is the user has remaining attempts ?
  const hasRemainingAttempts = quizz.allowedRetries - attempts.total > 0;

  return (
    <div className="text-nx-white">
      {hasRemainingAttempts ? (
        <>
          {step === Onboard && <QuizzOnboard {...commonProps} />}
          {step === Questions && <QuizzQuestions {...commonProps} />}
          {step === Recap && <QuizzRecap {...commonProps} />}
          {step === End && <QuizzEnd {...commonProps} />}
        </>
      ) : (
        <QuizzNoMoreAttempts attempts={attempts} {...commonProps} />
      )}
    </div>
  );
};
