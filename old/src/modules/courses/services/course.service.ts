import { Injectable } from "@polyflix/di";
import { StatusCodes } from "http-status-codes";
import { HttpService } from "../../common/services/http.service";
import { CourseFilter, ICourseFilter } from "../filters";
import { Course } from "../models";
import { CoursesWithPagination, ICourseForm } from "../types";

export type CourseParams = {
  page?: number;

  pageSize?: number;

  order?: string;

  slug?: string;

  title?: string;

  publisherId?: string;

  joinWithPublisher?: boolean;

  exact?: boolean;
};

@Injectable()
export class CourseService {
  constructor(
    private readonly httpService: HttpService,
    private readonly courseFilter: CourseFilter
  ) {}

  /**
   * Get the courses list paginated.
   * @param {Token} token the access token
   * @param {number | undefined} authorId the user to get courses from
   * @param {number | undefined} page the page to fetch
   * @param {number | undefined} limit the limit of items per page
   * @returns {Promise<CoursesWithPagination>}
   */

  public async getCourses(
    filters: ICourseFilter
  ): Promise<CoursesWithPagination> {
    const searchQuery = this.courseFilter.buildFilters(filters);
    let url = "/courses";
    if (searchQuery !== "" && searchQuery) {
      url += `?${searchQuery}`;
    }

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
   * Create a course
   * @param {ICourseForm} course the form data to post
   * @returns {Promise<Course>}
   */
  public async createCourse(course: ICourseForm): Promise<Course> {
    const { status, response, error } = await this.httpService.post(
      `/courses`,
      {
        body: course,
      }
    );
    if (status !== StatusCodes.CREATED) {
      throw error;
    }
    return response;
  }

  /**
   * Delete a course
   * @param {string} id the video id
   * @param {Token} token the access token
   */
  public async deleteCourse(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(
      `/courses/${id}`,
      {}
    );
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

  /**
   * Update a course
   * @param {string} id the course id
   * @param {ICourseForm} data the course form
   * @returns {Promise<Course>}
   */
  public async updateCourse(id: string, data: ICourseForm): Promise<Course> {
    const { status, response, error } = await this.httpService.put(
      `/courses/${id}`,
      {
        body: data,
      }
    );
    if (status !== StatusCodes.OK) {
      throw error;
    }
    return Course.fromJson(response);
  }
}
