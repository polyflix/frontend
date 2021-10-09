import { actionFactory } from "../../../common/factories/action.factory";
import { Attempt } from "../../models/attempt.model";
import {
  PlayQuizzAction,
  PlayQuizzState,
  PlayQuizzStep,
} from "../../types/play-quizz.type";

/**
 * AuthActions enumeration.
 */
export enum PlayQuizzActions {
  UPDATE_STEP = "UPDATE_STEP",
  SET_QUESTION_INDEX = "SET_QUESTION_INDEX",
  SET_ANSWER = "SET_ANSWER",
  SUBMIT_IN_PROGRESS = "SUBMIT_IN_PROGRESS",
  SUBMIT_SUCCESS = "SUBMIT_SUCCESS",
  SUBMIT_FAILURE = "SUBMIT_FAILURE",
  RESET = "RESET",
}

/**
 * Update the current step of the quizz with the new one.
 * @param {PlayQuizzStep} step
 * @returns
 */
export const UpdateStepAction = (step: PlayQuizzStep): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.UPDATE_STEP, {
    step,
  });
};

export const SetQuestionIndexAction = (idx: number): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.SET_QUESTION_INDEX, {
    questionIdx: idx,
  });
};

export const SetAnswerAction = (
  questionId: string,
  answerId: string
): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.SET_ANSWER, {
    answers: {
      [questionId]: [answerId],
    },
  });
};

export const SubmitInProgressAction = (): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.SUBMIT_IN_PROGRESS);
};

export const SubmitErrorAction = (): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.SUBMIT_FAILURE, {
    isSubmitting: false,
  });
};

export const SubmitSuccessAction = (attempt: Attempt): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.SUBMIT_SUCCESS, {
    attempt,
  });
};

export const ResetAction = (): PlayQuizzAction => {
  return actionFactory<PlayQuizzState>(PlayQuizzActions.RESET);
};
