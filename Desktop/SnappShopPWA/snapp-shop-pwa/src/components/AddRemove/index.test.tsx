import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import JestProvider from '@jest-provider'
import AddRemove from '.'

test('Showing add basket button with count 0', () => {
  render(
    <JestProvider>
      <AddRemove
        count={0}
        stock={0}
        onClickAdd={() => {}}
        onClickRemove={() => {}}
      />
    </JestProvider>
  )

  const addButton = screen.queryByText(/add/i)
  expect(addButton).toBeInTheDocument()
})

test('Showing add basket button with stock', () => {
  render(
    <JestProvider>
      <AddRemove
        count={0}
        stock={2}
        onClickAdd={() => {}}
        onClickRemove={() => {}}
      />
    </JestProvider>
  )
  const remainingStockMessage = screen.queryByText(/remaining-stock-number/i)
  expect(remainingStockMessage).toBeInTheDocument()
})

test('Do not show stock number if add basket is disable', () => {
  render(
    <JestProvider>
      <AddRemove
        count={0}
        stock={8}
        disableAdd={true}
        onClickAdd={() => {}}
        onClickRemove={() => {}}
      />
    </JestProvider>
  )
  const remainingStockMessage = screen.queryByText(/remaining-stock-number/i)
  expect(remainingStockMessage).not.toBeInTheDocument()
})

test('Disabled Add button if disableAdd prop is true', () => {
  render(
    <JestProvider>
      <AddRemove
        count={0}
        stock={5}
        disableAdd={true}
        onClickAdd={() => {}}
        onClickRemove={() => {}}
      />
    </JestProvider>
  )
  const addButton = screen.queryByText(/add/i)
  expect(addButton).toBeDisabled()
})

test('Do not show stock number in basket section', () => {
  render(
    <JestProvider>
      <AddRemove
        showStockLimit={false}
        count={1}
        stock={5}
        disableAdd={true}
        onClickAdd={() => {}}
        onClickRemove={() => {}}
      />
    </JestProvider>
  )
  const remainingStockMessage = screen.queryByText(/remaining-stock-number/i)
  expect(remainingStockMessage).not.toBeInTheDocument()
})
