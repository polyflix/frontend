import { GenericAction } from "../../../common";
import { actionFactory } from "../../../common/factories/action.factory";
import { SubtitleImprovement } from "../../models/subtitle-improvement.model";

export enum SubtitleImprovementListActions {
  UPDATE_LIST_SUCCESS = "UPDATE_LIST_SUCCESS",
  UPDATE_LIST_IN_PROGRESS = "UPDATE_LIST_IN_PROGRESS",
  UPDATE_LIST_FAILURE = "UPDATE_LIST_FAILURE",

  ADD_ELEMENT_SUCCESS = "ADD_ELEMENT_SUCCESS",
  ADD_ELEMENT_IN_PROGRESS = "ADD_ELEMENT_IN_PROGRESS",
  ADD_ELEMENT_FAILURE = "ADD_ELEMENT_FAILURE",

  UPDATE_ELEMENT_SUCCESS = "UPDATE_ELEMENT_SUCCESS",
  UPDATE_ELEMENT_IN_PROGRESS = "UPDATE_ELEMENT_IN_PROGRESS",
  UPDATE_ELEMENT_FAILURE = "UPDATE_ELEMENT_FAILURE",

  UPDATE_FORM_ELEMENT_IN_PROGRESS = "UPDATE_FORM_ELEMENT_IN_PROGRESS",
  UPDATE_FORM_ELEMENT_SUCCESS = "UPDATE_FORM_ELEMENT_SUCCESS",

  SET_BLOCK_SUCCESS = "SET_BLOCK_SUCCESS",

  DELETE_ELEMENT_SUCCESS = "DELETE_ELEMENT_SUCCESS",
  DELETE_ELEMENT_IN_PROGRESS = "DELETE_ELEMENT_IN_PROGRESS",
  DELETE_ELEMENT_FAILURE = "DELETE_ELEMENT_FAILURE",
}

export type SubtitleImprovementState = SubtitleImprovementItemState[];

export type SubtitleImprovementItemState = {
  text: string;
  timestamp: number;
  isLoading: boolean;
  isError: boolean;
  disableActions: boolean;
  item?: SubtitleImprovement;
  editingItem?: SubtitleImprovement;
  list: SubtitleImprovement[];
};

export type SubtitleImprovementItemAction =
  GenericAction<SubtitleImprovementItemState>;

export const UpdateListInProgress = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_LIST_IN_PROGRESS,
    {
      timestamp,
    }
  );
};

export const UpdateListFailure = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_LIST_FAILURE,
    {
      timestamp,
    }
  );
};

export const UpdateListSuccess = (
  timestamp: number,
  list: SubtitleImprovement[] | undefined
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_LIST_SUCCESS,
    {
      timestamp,
      list,
    }
  );
};

export const UpdateElementSuccess = (
  timestamp: number,
  item: SubtitleImprovement
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_ELEMENT_SUCCESS,
    {
      timestamp,
      item,
    }
  );
};

export const UpdateElementFailure = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_ELEMENT_FAILURE,
    {
      timestamp,
    }
  );
};

export const UpdateElementInProgress = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_ELEMENT_IN_PROGRESS,
    {
      timestamp,
    }
  );
};

export const AddElementSuccess = (
  timestamp: number,
  item: SubtitleImprovement
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.ADD_ELEMENT_SUCCESS,
    {
      timestamp,
      item,
    }
  );
};

export const AddElementFailure = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.ADD_ELEMENT_FAILURE,
    {
      timestamp,
    }
  );
};

export const AddElementInProgress = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.ADD_ELEMENT_IN_PROGRESS,
    {
      timestamp,
    }
  );
};

export const DeleteElementSuccess = (
  timestamp: number,
  item: SubtitleImprovement
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.DELETE_ELEMENT_SUCCESS,
    {
      timestamp,
      item,
    }
  );
};

export const DeleteElementFailure = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.DELETE_ELEMENT_FAILURE,
    {
      timestamp,
    }
  );
};

export const DeleteElementInProgress = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.DELETE_ELEMENT_IN_PROGRESS,
    {
      timestamp,
    }
  );
};

export const UpdateFormElementInProgress = (
  timestamp: number,
  editingItem: SubtitleImprovement
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_FORM_ELEMENT_IN_PROGRESS,
    {
      timestamp,
      editingItem,
    }
  );
};

export const UpdateFormElementSuccess = (
  timestamp: number
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.UPDATE_FORM_ELEMENT_SUCCESS,
    {
      timestamp,
    }
  );
};

export const SetBlockSuccess = (
  timestamp: number,
  text: string
): SubtitleImprovementItemAction => {
  return actionFactory<SubtitleImprovementItemState>(
    SubtitleImprovementListActions.SET_BLOCK_SUCCESS,
    {
      timestamp,
      text,
    }
  );
};
