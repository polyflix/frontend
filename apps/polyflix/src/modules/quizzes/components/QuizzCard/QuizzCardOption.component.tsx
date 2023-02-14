import { ListAlt, PlayArrow } from '@mui/icons-material'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { Element } from '@core/models/element.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Quizz } from '@quizzes/models/quizz.model'
import { useDeleteQuizzMutation } from '@quizzes/services/quizz.service'
import { polyflixRouter } from '@core/utils/routes'

interface OptionProps {
  quizz: Element<Quizz>
}

//CRUD management in user profile
export const QuizzSliderOption = ({ quizz }: OptionProps) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [deleteQuizz] = useDeleteQuizzMutation()

  const { t } = useTranslation('quizzes')

  const handleDelete = async () => {
    try {
      await deleteQuizz({ id: quizz.id }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Quizzes)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={polyflixRouter().studio.quizzes.update(quizz.id)}
      onDelete={handleDelete}
      publisherId={quizz?.user?.id!}
      type="quizzes"
    >
      <MenuItem component={RouterLink} to={`/quizzes/${quizz.id}/play`}>
        <ListItemIcon>
          <PlayArrow fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t('card.options.play')}</ListItemText>
      </MenuItem>
      <MenuItem component={RouterLink} to={`/quizzes/${quizz.id}/results`}>
        <ListItemIcon>
          <ListAlt fontSize="small" />
        </ListItemIcon>
        <ListItemText> {t('card.options.seeResults')}</ListItemText>
      </MenuItem>
    </CardMenu>
  )
}
