import { Injectable } from "@polyflix/di";
import { QuizzParser } from "@polyflix/quizz-parser";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services";
import { Pagination } from "../../common/types/crud.type";
import { IQuizzForm } from "../components/QuizzForm/QuizzForm.component";
import { QuizzAttemptFilters, QuizzFilters } from "../filters/quizz.filter";
import { Attempt } from "../models/attempt.model";
import { Quizz } from "../models/quizz.model";
import { CrudFilterService } from "./crud-filter.service";

@Injectable()
export class QuizzService {
  constructor(
    private readonly httpService: HttpService,
    private readonly filterService: CrudFilterService<QuizzFilters>
  ) {}

  /**
   * Fetch a paginated Quizzes list with provided filters.
   * @param filters
   * @returns
   */
  async getQuizzes(filters: QuizzFilters): Promise<Pagination<Quizz>> {
    const { status, response, error } = await this.httpService.get(
      `/quizzes${this.filterService.buildFilters(filters)}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    const { data, ...rest } = response;
    return { ...rest, data: data.map(Quizz.fromJson) };
  }

  /**
   * Fetch a Quizz entity by it's ID and with the provided filters.
   * @param id
   * @param filters
   * @returns
   */
  async getQuizz(id: string, filters?: QuizzFilters): Promise<Quizz> {
    const { status, response, error } = await this.httpService.get(
      `/quizzes/${id}${
        filters ? `${this.filterService.buildFilters(filters)}` : ""
      }`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }

    return Quizz.fromJson(response);
  }

  /**
   * Create a quizz resource
   * @param data
   * @returns
   */
  async createQuizz(data: IQuizzForm): Promise<Quizz> {
    const { status, response, error } = await this.httpService.post(
      `/quizzes`,
      { body: data }
    );

    if (status !== StatusCodes.CREATED) {
      throw error;
    }

    return Quizz.fromJson(response);
  }

  /**
   * Update a quizz resource
   * @param id
   * @param data
   * @returns
   */
  async updateQuizz(id: string, data: IQuizzForm): Promise<Quizz> {
    const { status, response, error } = await this.httpService.put(
      `/quizzes/${id}`,
      { body: data }
    );

    if (status !== StatusCodes.OK) {
      throw error;
    }

    return Quizz.fromJson(response);
  }

  async deleteQuizz(id: string): Promise<Quizz> {
    const { status, response, error } = await this.httpService.delete(
      `/quizzes/${id}`
    );

    if (status !== StatusCodes.OK) {
      throw error;
    }

    return Quizz.fromJson(response);
  }

  importFromFile(fileContent: string): Quizz | undefined {
    const { questions } = QuizzParser.parse(fileContent);
    return Quizz.fromJson({
      ...Quizz.default(),
      questions,
    });
  }

  async getQuizzesAttempts(
    quizzId: string,
    filters?: QuizzAttemptFilters
  ): Promise<Pagination<Attempt>> {
    const { status, error, response } = await this.httpService.get(
      `/quizzes/${quizzId}/attempts${this.filterService.buildFilters({
        ...filters,
      })}`
    );

    if (status !== StatusCodes.OK) {
      throw error;
    }

    const { data, ...rest } = response;
    return { ...rest, data: data.map(Attempt.fromJson) };
  }
}
