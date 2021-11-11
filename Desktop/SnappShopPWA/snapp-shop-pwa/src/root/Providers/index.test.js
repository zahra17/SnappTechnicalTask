import Providers from '.'

import Redux from './Redux'
import {QueryParamProvider} from './QueryProvider'
import AppDataProvider from './AppData'

describe('Providers component', () => {
  test("Get child's initial props", async () => {
    const mockGetInitialProps = jest.fn(x => x)

    Redux.getInitialProps = mockGetInitialProps
    QueryParamProvider.getInitialProps = mockGetInitialProps
    AppDataProvider.getInitialProps = mockGetInitialProps

    const ctx = {}

    await Providers.getInitialProps({ctx})

    expect(mockGetInitialProps.mock.calls.length).toBe(3)
    expect(mockGetInitialProps.mock.calls[0][0]).toMatchObject(ctx)
  })
})
