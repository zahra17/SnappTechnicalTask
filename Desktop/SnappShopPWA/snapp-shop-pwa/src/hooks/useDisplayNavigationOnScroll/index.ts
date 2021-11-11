import {HeaderMode, HeaderProps} from '@root/Layout/Header'
import debounce from 'lodash/debounce'
import React, {useEffect, useState} from 'react'

export const useDisplayNavigationOnScroll = (
  ref: React.RefObject<HTMLDivElement>,
  headerMode: HeaderMode = HeaderMode.others
) => {
  const [headerDisplayState, setHeaderDisplayState] = useState<boolean>(false)
  const headerState: HeaderProps = {
    displayState: headerDisplayState,
    headerMode,
  }

  useEffect(() => {
    const mainOffset = ref.current?.offsetTop ?? null
    const onMainScroll = () => {
      if (!mainOffset) return
      if (window.pageYOffset > mainOffset * 10) setHeaderDisplayState(true)
      else setHeaderDisplayState(false)
    }
    const debounceWindowScroll = debounce(onMainScroll, 50)
    window.addEventListener('scroll', debounceWindowScroll)
    const clear = () => {
      window.removeEventListener('scroll', debounceWindowScroll)
    }
    return clear
  }, [])

  return headerState
}
