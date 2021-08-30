import dayjs, { Dayjs } from "dayjs";
import { IPublisher } from "../../common";
import { Publisher } from "../../common/models";
import { QuizzAnswers } from "../types/play-quizz.type";

export interface IAttempt {
  id: string;
  score: number;
  answers: QuizzAnswers;
  createdAt?: string;
  user?: IPublisher;
}

export class Attempt {
  private constructor(
    private readonly _id: string,
    private readonly _score: number,
    private readonly _answers: QuizzAnswers,
    private readonly _createdAt: Dayjs,
    private readonly _user?: Publisher
  ) {}

  static fromJson(json: IAttempt): Attempt {
    return new Attempt(
      json.id,
      json.score,
      json.answers,
      dayjs(json.createdAt),
      json.user && Publisher.fromJson(json.user)
    );
  }

  get id(): string {
    return this._id;
  }

  get score(): number {
    return this._score;
  }

  get createdAt(): Dayjs {
    return this._createdAt;
  }

  get answers(): QuizzAnswers {
    return this._answers;
  }

  get user(): Publisher | undefined {
    return this._user;
  }

  getColor(): string {
    return "#FF0000";
  }
}
