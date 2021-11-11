import React from 'react'

import {SimplePageComponent} from '@root/types'

type Props = {statusCode?: number}

const Error: SimplePageComponent<Props> = ({statusCode}) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({res, err}) => {
  const statusCode = res?.statusCode && err?.statusCode
  return {statusCode}
}

export default Error
