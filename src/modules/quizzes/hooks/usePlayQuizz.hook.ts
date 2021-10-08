import { shallowEqual, useSelector } from 'react-redux'

import { RootState } from '../../common'
import { PlayQuizzState } from '../types/play-quizz.type'

export const usePlayQuizz = (): PlayQuizzState => {
  return useSelector((state: RootState) => state.playQuizz, shallowEqual)
}
