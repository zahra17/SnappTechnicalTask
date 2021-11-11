import React, {FC} from 'react'
import {PageTransition} from 'next-page-transitions'

const Transition: FC = ({children}) => {
  return (
    <PageTransition
      timeout={300}
      skipInitialTransition
      classNames='page-transition'
    >
      {children}
    </PageTransition>
  )
}

export default Transition
