import dayjs, { Dayjs } from "dayjs";
import { max } from "lodash";
import { IPublisher } from "../../common";
import { Publisher } from "../../common/models";
import { Visibility } from "../../common/types/crud.type";
import { User } from "../../users";
import { Attempt, IAttempt } from "./attempt.model";
import { IQuestion, Question } from "./question.model";

export interface IQuizz {
  id?: string;
  allowedRetries: number;
  draft: boolean;
  name: string;
  keepHighestScore: boolean;
  visibility: Visibility;
  questions?: IQuestion[];
  attempts?: IAttempt[];
  user?: IPublisher;
  createdAt?: string;
  updatedAt?: string;
}

export class Quizz {
  private constructor(
    private readonly _allowedRetries: number,
    private readonly _draft: boolean,
    private readonly _id: string,
    private readonly _name: string,
    private readonly _keepHighestScore: boolean,
    private readonly _visibility: Visibility,
    private readonly _questions: Question[],
    private readonly _attempts: Attempt[],
    private readonly _createdAt: Dayjs,
    private readonly _updatedAt: Dayjs,
    private readonly _publisher?: Publisher
  ) {}

  static default(): IQuizz {
    return {
      allowedRetries: 1,
      draft: false,
      name: "My Super Quizz",
      visibility: "public",
      keepHighestScore: false,
    };
  }

  static fromJson(json: IQuizz): Quizz {
    return new Quizz(
      json.allowedRetries,
      json.draft,
      json.id!,
      json.name,
      json.keepHighestScore,
      json.visibility,
      json.questions?.map(Question.fromJson) || [],
      json.attempts?.map(Attempt.fromJson) || [],
      dayjs(json.createdAt),
      dayjs(json.updatedAt),
      json.user && Publisher.fromJson(json.user)
    );
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get questions(): Question[] {
    return this._questions;
  }

  public get visibility(): Visibility {
    return this._visibility;
  }

  public get allowedRetries(): number {
    return this._allowedRetries;
  }

  public get draft(): boolean {
    return this._draft;
  }

  public get keepHighestScore(): boolean {
    return this._keepHighestScore;
  }

  public get link(): string {
    return `/quizzes/${this.id}`;
  }

  public get attempts(): Attempt[] {
    return this._attempts;
  }

  public get publisher(): Publisher | undefined {
    return this._publisher;
  }

  public toJson(): IQuizz {
    return {
      name: this._name,
      keepHighestScore: this._keepHighestScore,
      allowedRetries: this._allowedRetries,
      draft: this._draft,
      visibility: this._visibility,
      questions: this._questions.map((question) => question.toJson()),
    };
  }

  public getQuestion(idx: number): Question {
    if (idx > this.questions.length) {
      throw new Error("Question index out of range.");
    }
    return this.questions[idx];
  }

  public get score(): number {
    if (this.attempts.length <= 0) return 0;
    if (this.keepHighestScore) {
      return max(this.attempts.map((attempt) => attempt.score)) || 0;
    } else {
      return +(
        this.attempts
          .map(({ score }) => score)
          .reduce((acc, value) => acc + value, 0) / this.attempts.length
      ).toFixed(2);
    }
  }

  public get totalAttempts(): number {
    return this.attempts.length;
  }

  public get remainingAttempts(): number {
    return this.allowedRetries - this.totalAttempts;
  }

  public isCreator({ id }: User): boolean {
    return this._publisher?.id === id;
  }

  public get createdAt(): Dayjs {
    return this._createdAt;
  }

  public get updatedAt(): Dayjs {
    return this._updatedAt;
  }

  public isNew(): boolean {
    return Math.abs(this.createdAt.diff(dayjs(), "day")) < 7;
  }
}
