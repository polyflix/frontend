import { GenericAction } from "../../common";
import { Attempt } from "../models/attempt.model";
import { Quizz } from "../models/quizz.model";
import { PlayQuizzService } from "../services/play.service";

export interface QuizzAnswers {
  [questionId: string]: string[];
}

export interface PlayComponentProps {
  quizz: Quizz;
  playService: PlayQuizzService;
}

export enum PlayQuizzStep {
  Onboard,
  Questions,
  Recap,
  End,
}

export type PlayQuizzState = {
  /**
   * The step is used by our system to determine
   * what to display to the user.
   * There are 4 steps actually :
   * - Onboard : we should display an onboarding component which explain to the user how to play the quizz
   * - Questions : we should display the questions to the user
   * - Recap : we should display the list of questions and the user answers to the user before validating
   * - End : display the user score with a custom message
   */
  step: PlayQuizzStep;

  /**
   * The index of the current question
   */
  questionIdx: number;

  /**
   * An object containg the user answers, indexed by the questionId and the answers ID as an array
   */
  answers: QuizzAnswers;

  /**
   * The Quizz attempt once submitted
   */
  attempt?: Attempt;

  /**
   * A boolean to control the attempt submission
   */
  isSubmitting: boolean;

  /**
   * A boolean to check if the current state is the initial
   */
  isInitialState: boolean;
};

export type PlayQuizzAction = GenericAction<PlayQuizzState>;
