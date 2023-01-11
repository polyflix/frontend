import { Paper, Typography } from '@mui/material'
import { PageSection } from '../PageSection/page-section.component'

export const Footer = () => {
  return (
    <Paper
      variant="outlined"
      component={'footer'}
      sx={{
        minHeight: '200px',
        p: 2,
        mt: 4,
      }}
    >
      {/* TODO */}
      <PageSection>
        <Typography variant="body1" color="initial">
          Footer
        </Typography>
      </PageSection>
    </Paper>
  )
}
