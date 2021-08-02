import { Injectable } from "@polyflix/di";
import { HttpService } from "../../common/services/http.service";

@Injectable()
export class SubtitleImprovementService {
  constructor(private readonly httpService: HttpService) {}

  update(data: any) {
    console.log("update", data);
  }

  create(data: any) {
    console.log("create", data);
  }
}
