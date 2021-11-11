import {PageComponent, CTX} from './types'

function extractProps<IP, P>(component: PageComponent<IP, P>, ctx: CTX) {
  if (typeof component.getInitialProps === 'function') {
    return component.getInitialProps(ctx)
  }
  return undefined
}

export default extractProps
