import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { User } from '@users/models/user.model'

import { AdvancedForm } from './AdvancedForm.component'
import { InformationsForm } from './InformationsForm.component'
import { SecurityForm } from './SecurityForm.component'

interface Props {
  user: User
}

export const UserForm = ({ user }: Props) => {
  const { t } = useTranslation('users')

  /**
   * User profile edition will be partitionned in Tabs
   *
   * We need useState to get selected tab, and handleChange allow us to navigate through tabs
   *
   * https://mui.com/components/tabs/#main-content
   */
  const [selectedTab, setTab] = useState('1')
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  return (
    <Paper variant="outlined">
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleTabChange}
            aria-label="User profile form selector"
          >
            <Tab label={t('profile.tabs.account')} value="1" />
            {/*<Tab label={t('profile.tabs.security')} value="2" />
            <Tab label={t('profile.tabs.advanced')} value="3" />*/}
          </TabList>
        </Box>
        <TabPanel value="1">
          <InformationsForm title={t('profile.tabs.account')} user={user} />
        </TabPanel>
        <TabPanel value="2">
          <SecurityForm title={t('profile.tabs.security')} user={user} />
        </TabPanel>
        <TabPanel value="3">
          <AdvancedForm title={t('profile.tabs.advanced')} user={user} />
        </TabPanel>
      </TabContext>
    </Paper>
  )
}
