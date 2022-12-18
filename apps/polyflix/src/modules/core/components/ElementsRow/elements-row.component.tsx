import { buildSkeletons } from '@core/utils/gui.utils'
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Children, PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Icon } from '../Icon/Icon.component'

const StyledElementsRow = styled(Box)<any>(({ theme, rowGap }) => ({
  display: 'grid',
  rowGap: rowGap,
  columnGap: theme.spacing(3),
  width: '100%',
  overflow: 'hidden',
  alignItems: 'flex-start',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
}))
type ElementsRowProps = {
  title: string
  seeMoreRoute: string
  icon: string
  loading: boolean
  hasNoData?: boolean
  isError?: boolean
}

export const ElementsRow = ({
  children,
  title,
  seeMoreRoute,
  icon,
  loading,
  hasNoData = false,
  isError = false,
}: PropsWithChildren<ElementsRowProps>) => {
  const { t } = useTranslation('common')

  const rowGap = '32px'

  const theme = useTheme()
  const gt880: boolean = useMediaQuery(theme.breakpoints.up(880))
  const gt1400: boolean = useMediaQuery(theme.breakpoints.up(1400))
  const gt1800: boolean = useMediaQuery(theme.breakpoints.up(1800))

  const [childrenCount, setChildrenCount] = useState(2)

  const disableAction = () => loading || hasNoData

  useEffect(() => {
    if (gt1800) {
      setChildrenCount(5)
    } else if (gt1400) {
      setChildrenCount(4)
    } else if (gt880) {
      setChildrenCount(3)
    } else {
      setChildrenCount(2)
    }
  }, [gt880, gt1400, gt1800])

  const skeletons = buildSkeletons(5)

  const content = () => {
    if (isError) {
      return <Alert severity="error">{t('error.title')}</Alert>
    }
    if (loading) {
      return skeletons
        .slice(0, childrenCount)
        .map((skeleton, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width="100%"
            height="200px"
          />
        ))
    }

    if (!loading && hasNoData) {
      return (
        <Stack direction="column">
          <Alert severity="info">{t('noData.title')}</Alert>
        </Stack>
      )
    }

    return Children.toArray(children).slice(0, childrenCount)
  }

  return (
    <Stack direction="column" spacing={2}>
      <Stack spacing={1} justifyContent="space-between" direction="row">
        <Stack
          sx={{ flex: 1, minWidth: 0 }}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <Icon name={icon} />
          <Typography variant="h5" sx={{ fontWeight: 700 }} noWrap>
            {title}
          </Typography>
        </Stack>
        <Box>
          <Button
            component={RouterLink}
            to={seeMoreRoute}
            size="small"
            disabled={disableAction()}
            startIcon={<Icon name={'material-symbols:add'} />}
          >
            {t('actions.seeMore')}
          </Button>
        </Box>
      </Stack>
      <Box>
        <StyledElementsRow rowGap={rowGap}>{content()}</StyledElementsRow>
      </Box>
    </Stack>
  )
}
