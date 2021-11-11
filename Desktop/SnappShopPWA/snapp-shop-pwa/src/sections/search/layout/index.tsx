import React, {createRef} from 'react'
import {useSelector} from 'react-redux'
import {StyledLayout} from '@root/Layout'
import {Header, HeaderMode} from '@root/Layout/Header'
import {selectLocation} from '~growth/redux/location'
import {useDisplayNavigationOnScroll} from '@hooks/useDisplayNavigationOnScroll'

export const SearchLayout: React.FC = ({children, ...props}) => {
  const {activeLocation} = useSelector(selectLocation)
  const ref = createRef<HTMLDivElement>()
  const headerState = useDisplayNavigationOnScroll(ref, HeaderMode.home)

  return (
    <div>
      <Header headerMode={HeaderMode.home} />
      <StyledLayout {...props}>{children}</StyledLayout>
    </div>
  )
}
