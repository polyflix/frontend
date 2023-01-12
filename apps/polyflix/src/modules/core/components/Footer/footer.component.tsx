import { Divider, Link, List, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PageSection } from '../PageSection/page-section.component'

export const Footer = () => {
  const { t } = useTranslation('common')

  const links = [
    {
      title: 'footer.navigation.title',
      child: [
        {
          title: 'footer.navigation.homepage',
          href: '/',
          props: {},
        },
        {
          title: 'footer.navigation.videos',
          href: '/videos/explore',
          props: {},
        },
        {
          title: 'footer.navigation.courses',
          href: '/courses/explore',
          props: {},
        },
      ],
    },
    {
      title: 'footer.account.title',
      child: [
        {
          title: 'footer.account.profile',
          href: '/users/profile/videos',
          props: {},
        },
        {
          title: 'footer.account.settings',
          href: '/users/profile/settings',
          props: {},
        },
      ],
    },
    {
      title: 'footer.help.title',
      child: [
        {
          title: 'footer.help.cgu',
          href: 'https://github.com/polyflix/polyflix/blob/main/CGU-Polyflix.pdf',
          props: { rel: 'noopener noreferrer', target: '_blank' },
        },
        {
          title: 'footer.help.mentions',
          href: '#',
          props: { rel: 'noopener noreferrer', target: '_blank' },
        },
        {
          title: 'footer.help.bug',
          href: 'https://docs.google.com/forms/d/e/1FAIpQLScy8UUG38btVXtym4UTBWrJKaOAMRA8-zY2yxCCeUyYolTjOA/viewform',
          props: { rel: 'noopener noreferrer', target: '_blank' },
        },
      ],
    },
  ]
  return (
    <Paper
      variant="outlined"
      component={'footer'}
      sx={{
        minHeight: '200px',
        p: '3rem',
        mt: 4,
      }}
    >
      <PageSection>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="top"
          paddingBottom={2}
        >
          {links.map((section, i) => (
            <List key={i}>
              <Typography
                variant="h5"
                fontWeight={'bold'}
                component={'p'}
                paddingBottom={1}
                sx={{ fontSize: '0.8em !important' }}
              >
                {t(section.title)}
              </Typography>
              {section.child.map((link, j) => (
                <Link
                  key={j}
                  href={link.href}
                  underline="none"
                  variant="body2"
                  sx={{ display: 'block' }}
                  color="inherit"
                  {...link.props}
                >
                  {t(link.title)}
                </Link>
              ))}
            </List>
          ))}
        </Stack>
        <Divider orientation="horizontal" flexItem />
        <Typography
          variant="body2"
          paddingTop={2}
          width="100%"
          textAlign="center"
        >
          &copy; Copyright Polyflix 2022 {t('footer.rights')}
        </Typography>
      </PageSection>
    </Paper>
  )
}
