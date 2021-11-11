import React, {createContext, useContext, useState} from 'react'

interface SearchBoxState {
  isFocus: boolean
  changeState: Function
}
const initialContext: SearchBoxState = {
  isFocus: false,
  changeState: () => {},
}
export const SearchBoxContext = createContext<SearchBoxState>(initialContext)
const SearchBoxProvider: React.FC = ({children}) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const changeState = (state: boolean) => {
    setIsFocus(state)
  }

  return (
    <SearchBoxContext.Provider value={{isFocus, changeState}}>
      {children}
    </SearchBoxContext.Provider>
  )
}

export const useMapSearchBoxContext = () => {
  return useContext(SearchBoxContext)
}

export default SearchBoxProvider
