import React from 'react'
import {rem} from 'polished'
import styled, {useTheme} from 'styled-components'
import {SVGIcon, Text, SnappShopIcon as TypeMarkIcon} from '@sf/design-system'

interface NavbarProps {
  navMode?: string
  title: string
  logo?: boolean
  icon: SVGIcon
  handleIconClick: (event: React.MouseEvent<SVGSVGElement>) => void
}

const NavContainer = styled.div<NavbarProps>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: ${({navMode}) => (navMode === 'center' ? rem(56) : rem(112))};
  margin: 0;
  padding: ${rem(8)} ${rem(16)};
  direction: rtl;
  background: ${({theme}) => theme.surface.light};
  border-radius: ${rem(16)} ${rem(16)} 0 0;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${rem(40)};
  direction: rtl;

  > * {
    &:nth-child(1) {
      position: absolute;
      right: 20px;
      z-index: 999;
      cursor: pointer;
    }
  }

  svg:nth-last-child(1) {
    position: absolute;
    left: 20px;
  }
`
const CenterTitle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: ${rem(48)};
  direction: rtl;
`

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const theme = useTheme()

  return (
    <NavContainer {...props}>
      <Header>
        <props.icon onClick={props.handleIconClick} />
        {props.navMode === 'center' && (
          <CenterTitle>
            {props.title.split(' ').map((item: string) => (
              <Text
                scale='large'
                weight={item == 'یا' ? 'normal' : 'bold'}
                key={item}
              >
                {item}
                &nbsp;
              </Text>
            ))}
          </CenterTitle>
        )}
        {props.logo && (
          <TypeMarkIcon
            width='3.55rem'
            height='2rem'
            fill={theme.accent.main}
          />
        )}
      </Header>
      {props.navMode !== 'center' && (
        <Content>
          {props.title.split(' ').map((item: string) => (
            <Text
              scale='xlarge'
              weight={item == 'یا' ? 'normal' : 'bold'}
              key={item}
            >
              {item}
              &nbsp;
            </Text>
          ))}
        </Content>
      )}
    </NavContainer>
  )
}
export default Navbar

Navbar.defaultProps = {
  navMode: 'standard',
}
