import React, {useEffect} from 'react'
import {useTheme} from 'styled-components'
import {ColorWeight} from '@sf/design-system'

export function useBodyColor(colorWeight: ColorWeight) {
  const theme = useTheme()
  useEffect(() => {
    document.body.style.backgroundColor = theme.surface[colorWeight]
    return () => {
      document.body.style.backgroundColor = theme.surface.light
    }
  })
}
