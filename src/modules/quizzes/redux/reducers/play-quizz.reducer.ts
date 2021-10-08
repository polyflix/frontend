import {
  PlayQuizzAction,
  PlayQuizzState,
  PlayQuizzStep,
} from '../../types/play-quizz.type'
import { PlayQuizzActions } from '../actions/play-quizz.action'

const initialState: PlayQuizzState = {
  step: PlayQuizzStep.Onboard,
  questionIdx: 0,
  answers: {},
  isSubmitting: false,
  isInitialState: true,
}

/**
 * Quizz play state reducer
 * @param {PlayQuizzState} state the actual state
 * @param {PlayQuizzAction} action the action to dispatch
 * @returns {PlayQuizzState} the state updated
 */
export const playQuizzReducer = (
  state: PlayQuizzState = initialState,
  action: PlayQuizzAction
): PlayQuizzState => {
  switch (action.type) {
    case PlayQuizzActions.UPDATE_STEP:
    case PlayQuizzActions.SET_QUESTION_INDEX:
      return {
        ...state,
        ...action.payload,
        isInitialState: false,
      }
    case PlayQuizzActions.SET_ANSWER:
      const actualAnswers = state.answers || {}
      const newAnswers = action.payload?.answers || {}

      Object.entries(newAnswers).forEach(([questionId, [answer]]) => {
        const questionAnswers = actualAnswers[questionId]
        if (questionAnswers) {
          // If the answer is already into the array, we should remove it.
          actualAnswers[questionId] = questionAnswers.includes(answer)
            ? questionAnswers.filter((v) => v !== answer)
            : [...questionAnswers, answer]
        } else {
          actualAnswers[questionId] = [answer]
        }
      })

      return {
        ...state,
        isInitialState: false,
        answers: { ...actualAnswers },
      }
    case PlayQuizzActions.SUBMIT_IN_PROGRESS:
      return {
        ...state,
        isInitialState: false,
        isSubmitting: true,
      }
    case PlayQuizzActions.SUBMIT_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isInitialState: false,
        isSubmitting: false,
      }
    case PlayQuizzActions.RESET:
      return {
        ...initialState,
      }
    default:
      return state
  }
}
