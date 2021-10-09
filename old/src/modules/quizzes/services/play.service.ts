import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService, ReduxService } from "../../common/services";
import { Attempt } from "../models/attempt.model";
import {
  ResetAction,
  SetAnswerAction,
  SetQuestionIndexAction,
  SubmitErrorAction,
  SubmitInProgressAction,
  SubmitSuccessAction,
  UpdateStepAction,
} from "../redux/actions/play-quizz.action";
import {
  PlayQuizzAction,
  PlayQuizzStep,
  QuizzAnswers,
} from "../types/play-quizz.type";

@Injectable()
export class PlayQuizzService {
  constructor(
    private readonly reduxService: ReduxService<PlayQuizzAction>,
    private readonly httpService: HttpService
  ) {}

  setStep(step: PlayQuizzStep): void {
    this.reduxService.dispatch(UpdateStepAction(step));
  }

  setQuestionIndex(idx: number): void {
    this.reduxService.dispatch(SetQuestionIndexAction(idx));
  }

  setAnswer(questionId: string, answerId: string): void {
    this.reduxService.dispatch(SetAnswerAction(questionId, answerId));
  }

  reset(): void {
    this.reduxService.dispatch(ResetAction());
  }

  async submit(quizzId: string, answers: QuizzAnswers): Promise<Attempt> {
    this.reduxService.dispatch(SubmitInProgressAction());

    const { response, status, error } = await this.httpService.post(
      `/quizzes/${quizzId}/attempts`,
      { body: { answers } }
    );

    if (status !== StatusCodes.CREATED) {
      this.reduxService.dispatch(SubmitErrorAction());
      throw error;
    }
    const attempt = Attempt.fromJson(response);
    this.reduxService.dispatch(SubmitSuccessAction(attempt));
    return attempt;
  }
}
