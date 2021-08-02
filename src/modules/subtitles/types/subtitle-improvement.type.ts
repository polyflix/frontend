import { AlertType } from "../../ui/components/Alert/Alert.component";
import { User } from "../../users";
import { SubtitleImprovementMeta } from "../models/subtitle-improvement-meta.model";

export interface ISubtitleImprovementForm {
  id: string;
  subtitleId: string;
  comment: string;
}

export type SubtitleImprovementState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  triggerReload: () => void;
};

export interface ISubtitleImprovement {
  id: string;
  subtitleId: string;
  comment: string;
  likes: number;
  isApproved: boolean;
  createdBy: User;
  subtitleImprovementMeta: SubtitleImprovementMeta;
  createdAt: Date;
  updatedAt: Date;
}
