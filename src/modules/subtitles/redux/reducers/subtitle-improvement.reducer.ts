import { SubtitleImprovement } from '../../models/subtitle-improvement.model'
import {
  SubtitleImprovementItemAction,
  SubtitleImprovementListActions,
  SubtitleImprovementState,
} from '../actions/subtitle-improvement.action'

const initialState: SubtitleImprovementState = []

export const subtitleImprovementReducer = (
  state: SubtitleImprovementState = initialState,
  action: SubtitleImprovementItemAction
): SubtitleImprovementState => {
  switch (action.type) {
    case SubtitleImprovementListActions.UPDATE_LIST_SUCCESS:
      if (state?.some((elm) => elm.timestamp === action.payload?.timestamp)) {
        return state.map((elm) => {
          if (elm.timestamp === action.payload?.timestamp) {
            return {
              ...elm,
              list: action.payload?.list as SubtitleImprovement[],
              disableActions: false,
              isLoading: false,
            }
          }
          return elm
        })
      }
      return state.concat({
        ...state,
        list: action.payload?.list as SubtitleImprovement[],
        timestamp: action.payload?.timestamp as number,
        disableActions: false,
        isLoading: false,
        isError: false,
      })
    case SubtitleImprovementListActions.UPDATE_LIST_IN_PROGRESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: true,
            disableActions: true,
            isError: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.UPDATE_LIST_FAILURE:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: false,
            isError: true,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.ADD_ELEMENT_SUCCESS:
      if (state?.some((elm) => elm.timestamp === action.payload?.timestamp)) {
        return state.map((elm) => {
          if (elm.timestamp === action.payload?.timestamp) {
            return {
              ...elm,
              isLoading: false,
              disableActions: false,
              isError: false,
              list: elm.list.concat(
                action?.payload?.item as SubtitleImprovement
              ) as SubtitleImprovement[],
              item: undefined,
            }
          }
          return elm
        })
      } else {
        return state.concat({
          ...state,
          list: [action.payload?.item as SubtitleImprovement],
          timestamp: action.payload?.timestamp as number,
          disableActions: false,
          isLoading: false,
          isError: false,
          item: undefined,
        })
      }
    case SubtitleImprovementListActions.ADD_ELEMENT_IN_PROGRESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: true,
            isError: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.ADD_ELEMENT_FAILURE:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: false,
            isError: true,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.UPDATE_ELEMENT_SUCCESS:
      if (state?.some((elm) => elm.timestamp === action.payload?.timestamp)) {
        return state.map((elm) => {
          if (elm.timestamp === action.payload?.timestamp) {
            return {
              ...elm,
              isLoading: false,
              disableActions: false,
              isError: false,
              editingItem: undefined,
              list: elm.list.map((item) => {
                if (item.id === action.payload?.item?.id) {
                  return {
                    ...item,
                    ...action.payload?.item,
                  } as SubtitleImprovement
                }
                return item
              }),
            }
          }
          return elm
        })
      } else {
        return state
      }
    case SubtitleImprovementListActions.UPDATE_ELEMENT_IN_PROGRESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: true,
            isError: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.UPDATE_ELEMENT_FAILURE:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: false,
            isError: true,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.UPDATE_FORM_ELEMENT_IN_PROGRESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            editingItem: action.payload?.editingItem,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.UPDATE_FORM_ELEMENT_SUCCESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            editingItem: undefined,
            isLoading: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.DELETE_ELEMENT_SUCCESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            list: elm.list?.filter(
              (subtitleImprovement: SubtitleImprovement) =>
                subtitleImprovement.id !== action.payload?.item?.id
            ),
            isLoading: false,
            disableActions: false,
            isError: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.DELETE_ELEMENT_IN_PROGRESS:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            disableActions: true,
            isError: false,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.DELETE_ELEMENT_FAILURE:
      return state.map((elm) => {
        if (elm.timestamp === action.payload?.timestamp) {
          return {
            ...elm,
            isLoading: false,
            disableActions: false,
            isError: true,
          }
        }
        return elm
      })
    case SubtitleImprovementListActions.SET_BLOCK_SUCCESS:
      if (state?.some((elm) => elm.timestamp === action.payload?.timestamp)) {
        return state.map((elm) => {
          if (elm.timestamp === action.payload?.timestamp) {
            return {
              ...elm,
              text: action.payload?.text as string,
            }
          }
          return elm
        })
      }
      return state.concat({
        ...state,
        text: action.payload?.text as string,
        timestamp: action.payload?.timestamp as number,
        disableActions: false,
        isLoading: false,
        isError: false,
      })
    default:
      return state
  }
}
