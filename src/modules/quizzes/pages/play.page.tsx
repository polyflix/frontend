import { useInjection } from "@polyflix/di";
import { useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useAuth } from "../../authentication";
import { Container, fadeOpacity, Page } from "../../ui";
import { QuizzPlay } from "../components/QuizzPlay/QuizzPlay.component";
import { useQuizz } from "../hooks/useQuizz.hook";
import { useQuizzAttempts } from "../hooks/useQuizzAttempts.hook";
import { PlayQuizzService } from "../services/play.service";

export const PlayQuizzPage = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const playService = useInjection<PlayQuizzService>(PlayQuizzService);

  const { data, isLoading, alert } = useQuizz(id, {
    draft: false,
    join: [
      "questions",
      {
        field: "questions.alternatives",
        // We want to select only the label to prevent cheat,
        // otherwise we can see the good anwser for each questions in the JSON response.
        select: ["label"],
      },
    ],
  });
  const { data: attempts, isLoading: isAttemptsLoading } = useQuizzAttempts(
    id,
    {
      join: [{ field: "user", select: ["firstName", "lastName"] }],
      "user.id": user?.id,
    }
  );

  useEffect(() => {
    // On component unmount, we want to reset the play state
    return () => playService.reset();
  }, [playService]);

  if (!isLoading && !isAttemptsLoading && alert) {
    return <Redirect to="/not-found" />;
  }

  return (
    <Page isLoading={isLoading || isAttemptsLoading} variants={fadeOpacity}>
      <Container mxAuto className="text-nx-white">
        {data && attempts && <QuizzPlay quizz={data} attempts={attempts} />}
      </Container>
    </Page>
  );
};
