import { Box } from '@mui/system'
import { forwardRef, PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'

interface Props {
  title?: string
}

// eslint-disable-next-line react/display-name
export const Page = forwardRef(
  ({ children, title = '', ...other }: PropsWithChildren<Props>, ref) => (
    <Box ref={ref} {...other}>
      <Helmet>
        <title>{title === '' ? 'Polyflix' : `${title} | Polyflix`}</title>
      </Helmet>
      {children}
    </Box>
  )
)
