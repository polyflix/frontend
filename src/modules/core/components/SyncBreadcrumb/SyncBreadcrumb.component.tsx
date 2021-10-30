import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Route } from 'react-router-dom'

import {
  breadcrumbNameMap,
  escapedURI,
} from '@core/constants/breadcrumb.constant'
import { capitalize } from '@core/helpers/textFormatter.helper'

interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}
const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
)

export function SyncBreadcrumb() {
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split('/').filter((x) => x)

        // Some page don't need breadcrumb, like homepage or escaped pages
        const shouldDisplayBreadcrumb =
          pathnames.length !== 0 && !escapedURI.includes(pathnames[0])

        return (
          shouldDisplayBreadcrumb && (
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextIcon fontSize="small" />}
            >
              <LinkRouter underline="hover" color="inherit" to="/">
                Home
              </LinkRouter>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1
                const to = `/${pathnames.slice(0, index + 1).join('/')}`

                return last ? (
                  <Typography color="text.primary" key={to}>
                    {breadcrumbNameMap[to]
                      ? breadcrumbNameMap[to]
                      : capitalize(value)}
                  </Typography>
                ) : (
                  <LinkRouter
                    underline="hover"
                    color="inherit"
                    to={to}
                    key={to}
                  >
                    {breadcrumbNameMap[to]
                      ? breadcrumbNameMap[to]
                      : capitalize(value)}
                  </LinkRouter>
                )
              })}
            </Breadcrumbs>
          )
        )
      }}
    </Route>
  )
}
