import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { Token } from "../../authentication/models/token.model";
import { HttpService } from "../../common/services/http.service";
import { Course } from "../models";
import { CoursesWithPagination } from "../types";

export type CourseParams = {
  page?: number;

  pageSize?: number;

  order?: string;

  slug?: string;

  title?: string;

  authorId?: string;

  joinWithPublisher?: boolean;
};

@Injectable()
export class CourseService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Get the courses list paginated.
   * @param {Token} token the access token
   * @param {number | undefined} authorId the user to get courses from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<CoursesWithPagination>}
   */

  public async getCourses(
    params: CourseParams
  ): Promise<CoursesWithPagination> {
    const { pageSize, page, authorId } = params;
    const path = "/courses";
    // Build search query
    let query = new URLSearchParams();
    if (page || pageSize) {
      query = new URLSearchParams();
      if (page) query.append("page", page.toString());
      if (pageSize) query.append("pageSize", pageSize.toString());
    }
    if (authorId) query.append("authorId", authorId);

    // Build the URL for the request.
    // The format is the following : /courses[/me][?page=1&limit=20]
    const url = `${path}${query ? "?" + query.toString() : ""}`;

    const { status, response, error } = await this.httpService.get(url);
    if (status !== 200) {
      throw error;
    }
    return {
      totalCount: response.totalCount,
      items: response.items.map(Course.fromJson),
    };
  }

  /**
   * Delete a course
   * @param {string} id the video id
   * @param {Token} token the access token
   */
  public async deleteCourse(id: string, token: Token): Promise<void> {
    const { status, error } = await this.httpService.delete(`/courses/${id}`, {
      headers: token.getAuthorizationHeader(),
    });
    if (status !== StatusCodes.NO_CONTENT) {
      throw error;
    }
  }

  /**
   * Find a course by slug.
   * @param {string} slug the video slug
   * @returns {Promise<Video>}
   */
  public async getCourseBySlug(slug: string): Promise<Course> {
    const { status, response, error } = await this.httpService.get(
      `/courses/${slug}`
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }

    return Course.fromJson({ ...response });
  }
}
