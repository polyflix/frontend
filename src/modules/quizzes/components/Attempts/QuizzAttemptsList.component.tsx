import { AnimateSharedLayout, motion } from "framer-motion";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../authentication";
import { Attempt } from "../../models/attempt.model";
import { Quizz } from "../../models/quizz.model";
import { QuizzAttemptListItem } from "./QuizzAttemptListItem.component";

type Props = {
  attempts?: Attempt[];
  quizz?: Quizz;
};

export const QuizzAttemptsList = ({ attempts, quizz }: Props) => {
  const { t } = useTranslation("resources");
  const { user } = useAuth();
  const data = attempts || [];
  return (
    <AnimateSharedLayout>
      {isEmpty(data) && (
        <div className="bg-darkgray mb-5 rounded-md p-5">
          {t("quizzes.attempts.noData")}
        </div>
      )}
      <motion.div layout>
        {data.map((attempt, idx) => {
          const isLast = idx === quizz!.attempts.length - 1;
          return (
            <motion.div layout key={attempt?.id}>
              <QuizzAttemptListItem
                isLoggedUser={attempt.user?.id === user?.id}
                attempt={attempt}
                isLast={isLast}
                quizz={quizz!}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimateSharedLayout>
  );
};
