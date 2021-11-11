import React, {createContext, useEffect, useState} from 'react'

import {SimplePageComponent} from '@root/types'
import {Product, ToppingBase} from '@schema/product'
import {CreatePayload} from '@schema/basket'
import {Coupon} from '@schema/coupon'

type VendorState = CreatePayload | undefined
type ActiveProduct = Product | undefined

interface ProductStates {
  vendorState?: VendorState
  activeProduct?: ActiveProduct
  isToppingModalOpen?: boolean
  activeToppings?: ToppingBase[]
  activeCoupon?: Coupon
}

type ContextType = ProductStates & {
  setContextState?: (data: ProductStates) => void
}

const initialState: ProductStates = {
  vendorState: undefined,
  activeProduct: undefined,
  isToppingModalOpen: false,
  activeToppings: [],
  activeCoupon: undefined,
}

export const ProductContext = createContext<ContextType>({})

const ProductProvider: React.FC = ({children}) => {
  const [ctxState, setCtxState] = useState(initialState)

  const setContextState = (data: ProductStates) => {
    setCtxState((oldState: ProductStates) => ({...oldState, ...data}))
  }

  useEffect(() => {
    if (!ctxState.isToppingModalOpen) {
      setCtxState(({vendorState}) => ({...initialState, vendorState}))
    }
  }, [ctxState.isToppingModalOpen])

  const value: ContextType = {...ctxState, setContextState}

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function withProductContext<S>(Wrapped: SimplePageComponent<S>) {
  const Wrapper: SimplePageComponent<S> = props => (
    <ProductProvider>
      <Wrapped {...props} />
    </ProductProvider>
  )
  if (Wrapped.getInitialProps) {
    Wrapper.getInitialProps = Wrapped.getInitialProps
  }
  return Wrapper
}

export default ProductProvider
