import { Alternative, IAlternative } from "./alternative.model";

export interface IQuestion {
  id?: string;
  index: number;
  label: string;
  alternatives?: IAlternative[];
}

export class Question {
  private constructor(
    private readonly _id: string,
    private readonly _index: number,
    private readonly _label: string,
    private readonly _alternatives: Alternative[]
  ) {}

  static fromJson(json: IQuestion): Question {
    return new Question(
      json.id!,
      json.index,
      json.label,
      json.alternatives?.map(Alternative.fromJson) || []
    );
  }

  /**
   * Remove empty alternatives from all questions of an array of questions
   * @param questions
   * @returns
   */
  static clearAlternatives(questions: IQuestion[]): IQuestion[] {
    return questions.map((q) => ({
      ...q,
      alternatives: q.alternatives?.filter((alt) => alt.label !== ""),
    }));
  }

  /**
   * A question should be valid if there is at least one correct alternative
   * @param question
   * @returns
   */
  static validate(question: IQuestion): boolean {
    return (
      question.alternatives!.some((alt) => alt.isCorrect) &&
      question.alternatives!.length >= 2
    );
  }

  get index(): number {
    return this._index;
  }

  get label(): string {
    return this._label;
  }

  get alternatives(): Alternative[] {
    return this._alternatives;
  }

  get id(): string {
    return this._id;
  }

  public getAlternative(id: string): Alternative | undefined {
    return this.alternatives.find((alt) => alt.id === id);
  }

  public toJson(): IQuestion {
    return {
      index: this._index,
      label: this._label,
      alternatives: this._alternatives.map((alt) => alt.toJson()),
    };
  }
}
