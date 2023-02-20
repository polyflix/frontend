import { Page } from '@core/components/Page/Page.component'
import { ErrorLayout } from '@layouts/Error/Error.layout'

export const ServiceUnavailablePage = () => {
  return (
    <Page title="Service unavailable">
      <ErrorLayout isPage code={503} />
    </Page>
  )
}
