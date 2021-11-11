import {defaultTheme, ThemeType} from '@sf/design-system'

const theme: ThemeType = {
  ...defaultTheme,
  accent: {
    ...defaultTheme.accent,
    dark: '#9C008E',
    main: '#B400AF',
    light: '#CC47C0',
    alphaHigh: 'rgba(180, 0, 164, 0.24)',
    alphaMedium: 'rgba(180, 0, 164, 0.12)',
    alphaLight: 'rgba(180, 0, 164, 0.06)',
  },
}

export {theme}
