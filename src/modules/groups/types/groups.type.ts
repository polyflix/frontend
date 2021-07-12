import { Group } from "../models/group.model";
import { Member } from "../models/member.model";
import { AlertType } from "../../ui";

export interface IGroup {
  id: number;
  title: string;
  description: string;
  slug: string;
  owner: string;
  members: Member[];
}

export type GroupsWithPagination = {
  totalCount: number;
  groups: Group[];
};

export type GroupState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
  triggerReload: () => void;
};

export interface IGroupForm {
  title: string;
  description: string;
  owner: string;
}
