import React, { PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet-async'

type PageProps = {
  title: string
}

export const Page: React.FC<PropsWithChildren<PageProps>> = ({
  children,
  title,
}) => {
  return (
    <>
      <Helmet>
        <title>{title === '' ? 'Polyflix' : `${title} | Polyflix`}</title>
      </Helmet>
      <main>{children}</main>
    </>
  )
}
