import { useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import { DashBoardNavbar } from '@core/components/DashBoard/DashBoardNavbar/DashBoardNavbar.component'
import { DashBoardSidebar } from '@core/components/DashBoard/DashBoardSidebar/DashBoardSidebar.component'
import { Page } from '@core/layouts/Page.layout'

import { MainStyle, RootStyle } from './DashBoard.style'

const DashBoardRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Page title="Home">Home</Page>
      </Route>
    </Switch>
  )
}

export const DashBoardLayout: React.FC = () => {
  const [open, setOpen] = useState(false)

  const toggleSidebar = (): void => {
    setOpen(!open)
  }
  return (
    <RootStyle>
      <DashBoardNavbar isOpenSidebar={open} />
      <DashBoardSidebar isOpenSidebar={open} toggleSidebar={toggleSidebar} />
      <MainStyle>
        <DashBoardRouter />
      </MainStyle>
    </RootStyle>
  )
}
