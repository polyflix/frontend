import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'
import { PolyflixLanguage } from '@core/types/language.type'

import { MenuPopover } from '../MenuPopOver/MenuPopOver.component'

export const LanguageButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { t, i18n } = useTranslation()

  let currentLanguage = localStorage.getItem('i18nextLng')

  if (currentLanguage && currentLanguage.length > 2) {
    currentLanguage = currentLanguage.substring(0, 2)
    localStorage.setItem('i18nextLng', currentLanguage)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleChange = (lang: string) => () => {
    i18n.changeLanguage(lang)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title={t<string>('navbar.actions.language')}>
        <IconButton
          id="icon-button"
          aria-controls="language-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Icon name="ion:language" />
        </IconButton>
      </Tooltip>
      <MenuPopover anchorEl={anchorEl} open={open} onClose={handleClose}>
        <List sx={{ borderRadius: 'inherit', padding: 0 }}>
          {PolyflixLanguage.map((lang) => {
            return (
              <ListItemButton
                onClick={handleChange(lang.lang)}
                key={lang.lang}
                selected={currentLanguage == lang.lang}
                sx={{ borderRadius: 'inherit', margin: 1 }}
              >
                <ListItemIcon>
                  <Icon name={lang.icon} />
                </ListItemIcon>
                {lang.name}
              </ListItemButton>
            )
          })}
        </List>
      </MenuPopover>
    </>
  )
}
