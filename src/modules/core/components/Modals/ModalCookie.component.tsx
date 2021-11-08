import { Button, Modal, Paper, Typography } from '@mui/material'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '50%' },
  p: 4,
  outline: 'none',
}

const styleButton = {
  textAlign: 'right',
}

function setCookie(cookieName: string, cookieValue: string, expDays: number) {
  const date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  document.cookie = `${cookieName}=${cookieValue};expires=${date.toUTCString()};path=/`
}

/**
 *  Get the value for an asked cookie
 * @param cname name of the cookies
 * @returns the value of the cookie
 */
function getCookie(cookieName: string): string {
  return document.cookie.split(';').reduce((acc, cur) => {
    const [key, value] = cur.split('=')
    if (key === cookieName) {
      return value
    }
    return acc
  }, '')
}

export default function ModalCookies() {
  const { t } = useTranslation('common', { keyPrefix: 'cookie' })

  const cookieName = 'consentcookies'
  const [open, setOpen] = React.useState(getCookie(cookieName) !== 'accepted')
  const handleClose = () => {
    setCookie(cookieName, 'accepted', 30)
    setOpen(false)
  }

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Paper sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Polyflix
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {t('description')}
          </Typography>
          <Button sx={styleButton} onClick={handleClose}>
            {t('accept')}
          </Button>
        </Paper>
      </Modal>
    </div>
  )
}
