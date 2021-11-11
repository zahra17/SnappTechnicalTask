import React from 'react'
import styled from 'styled-components'
import {Button} from '@sf/design-system'

interface FooterProps {
  title: string
  isLoading: boolean
}

const Layout = styled.div`
  padding: 12px;

  button {
    height: 3rem;
  }
`

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const {title, isLoading} = props

  return (
    <Layout>
      <Button
        block
        type='submit'
        appearance={'solid'}
        colorName={'accent'}
        isLoading={isLoading}
      >
        {title}
      </Button>
    </Layout>
  )
}

export default Footer
