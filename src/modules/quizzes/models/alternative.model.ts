export interface IAlternative {
  id?: string
  isCorrect: boolean
  label: string
}

export class Alternative {
  private constructor(
    private readonly _id: string,
    private readonly _isCorrect: boolean,
    private readonly _label: string
  ) {}

  static fromJson(json: IAlternative): Alternative {
    return new Alternative(json.id!, json.isCorrect, json.label)
  }

  get isCorrect(): boolean {
    return this._isCorrect
  }

  get label(): string {
    return this._label
  }

  get id(): string {
    return this._id
  }

  public toJson(): IAlternative {
    return {
      isCorrect: this._isCorrect,
      label: this._label,
    }
  }
}
