import ProtectRoute from '.'

describe('Protected component', () => {
  test("Get child's initial props", async () => {
    const mockGetInitialProps = jest.fn(x => x)
    const Component = {getInitialProps: ctx => mockGetInitialProps(ctx)}

    const ctx = {store: {getState: () => ({core: {user: null}})}}

    const Protected = ProtectRoute(Component)
    await Protected.getInitialProps(ctx)

    expect(mockGetInitialProps.mock.calls.length).toBe(1)
    expect(mockGetInitialProps.mock.calls[0][0]).toMatchObject(ctx)
  })
})
