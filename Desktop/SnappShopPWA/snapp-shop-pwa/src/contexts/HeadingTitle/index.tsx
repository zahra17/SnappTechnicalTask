import {getHeadingTitle} from '@components/CustomHead/hooks/getHeadingTitle'
import React, {createContext, useContext, useState} from 'react'
export interface HeadingTitleContext {
  changeTitle: Function
  title: string | null
}
const HeadingTitleContext = createContext<HeadingTitleContext>({
  changeTitle: (title: string | null) => {},
  title: '',
})

const HeadingTitleProvider: React.FC = ({children}) => {
  const [title, setTitle] = useState<string | null>(null)
  const changeTitle = async (
    type: string | null,
    city: string | null,
    city_area: string | null,
    tagTitle: string | null,
    serviceName: string | null,
    chainName: string | null,
    hasError: boolean
  ) => {
    if (hasError) return setTitle(null)
    const generatedTitle = await getHeadingTitle(
      type,
      city,
      city_area,
      tagTitle,
      serviceName,
      chainName
    )
    setTitle(generatedTitle)
  }

  return (
    <HeadingTitleContext.Provider value={{changeTitle, title}}>
      {children}
    </HeadingTitleContext.Provider>
  )
}

export const useHeadingTitleContext = () => {
  return useContext(HeadingTitleContext)
}

export default HeadingTitleProvider
