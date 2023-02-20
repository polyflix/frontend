import { createContext, PropsWithChildren, useState } from 'react'

import { Attempt } from '@types_/resources/quizz.type'
import { QuizzAnswers, Step } from '@types_/resources/quizz.type'

export interface IPlayQuizzState {
  /**
   * The step is used by our system to determine
   * what to display to the user.
   * There are 4 steps :
   * - Onboard : we should display an onboarding component which explain to the user how to play the quizz
   * - Questions : we should display the questions to the user
   * - Recap : we should display the list of questions and the user answers to the user before validating
   * - End : display the user score with a custom message
   */
  step: Step

  /**
   * The index of the current question
   */
  questionIdx: number

  /**
   * An object containg the user answers, indexed by the questionId and the answers ID as an array
   */
  answers: QuizzAnswers

  /**
   * The Quizz attempt once submitted
   */
  attempt?: Attempt
}

// The definition of the play quizz context
export interface IPlayQuizzContext extends IPlayQuizzState {
  /**
   * Change the step of the attempt.
   * @param step the new step
   */
  setStep: (step: Step) => void
  /**
   * Change the current question
   * @param index the index of the question to get
   */
  setQuestion: (index: number) => void
  /**
   * Set the answer for a question
   * @param questionId
   * @param answers
   */
  setAnswer: (questionId: string, alternativeId: string) => void
  /**
   * Set the attempt when successfully saved
   * @param attempt
   */
  setAttempt: (attempt: Attempt) => void
}

// The context of the quizz
export const PlayQuizzContext = createContext<IPlayQuizzContext | undefined>(
  undefined
)

// The PlayQuizzProvider allows every children to access the context. It allows them to use the
// usePlayQuizz hook in the components hierarchy to access the quizz attempt state.
export const PlayQuizzProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, setState] = useState<IPlayQuizzState>({
    step: Step.Onboard,
    answers: {},
    questionIdx: 0,
  })

  /**
   * Change the step of the attempt.
   * @param step the new step
   */
  const setStep = (step: Step) => {
    setState((previousState) => ({ ...previousState, step }))
  }

  /**
   * Change the current question
   * @param index the index of the question to get
   */
  const setQuestion = (index: number) => {
    setState((previousState) => ({ ...previousState, questionIdx: index }))
  }

  /**
   * Set the answer for a question
   * @param questionId
   * @param answers
   */
  const setAnswer = (questionId: string, alternativeId: string) => {
    const actualAnswers = state.answers || {}
    const answers: QuizzAnswers = { [questionId]: [alternativeId] }
    Object.entries(answers).forEach(([question, [answer]]) => {
      const questionAnswers = actualAnswers[question]
      if (questionAnswers) {
        // If the answer is already into the array, we should remove it.
        actualAnswers[questionId] = questionAnswers.includes(answer)
          ? questionAnswers.filter((v) => v !== answer)
          : [...questionAnswers, answer]
      } else {
        actualAnswers[questionId] = [answer]
      }
    })

    setState((previousState) => ({ ...previousState, answers: actualAnswers }))
  }

  /**
   * Set the attempt into the state
   * @param attempt
   */
  const setAttempt = (attempt: Attempt) => {
    setState((previousState) => ({ ...previousState, attempt }))
  }

  return (
    <PlayQuizzContext.Provider
      value={{ ...state, setStep, setQuestion, setAnswer, setAttempt }}
    >
      {children}
    </PlayQuizzContext.Provider>
  )
}
