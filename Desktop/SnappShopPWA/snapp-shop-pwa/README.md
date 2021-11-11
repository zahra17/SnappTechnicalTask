# Snappfood Desktop Application

This application powerd by **TypeScript**, **Next.js**, **Redux**, **Redux-Toolkit**, **Storybook** and many other cool features.

First, run this command to install the dependencies

```bash
npm install
#or
yarn
```

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3004](http://localhost:3004) with your browser to see the result.

You can start editing the page by modifying `pages/index.jsx`. The page auto-updates as you edit the file.

Start the Storybook development server:

```bash
npm run storybook
# or
yarn storybook
```

To Build and start the production server

```bash
npm run build
npm start
# or
yarn build
yarn start
```

To run Unit tests

```bash
npm run test
npm run test:watch
# or
yarn test
yarn test:watch
```

To run Ene-to-End tests

```bash
npm run e2e:open
npm run e2e:run
# or
yarn e2e:open
yarn e2e:run
```

---

## Redux Toolkit (RTK)

### For writing a slice state for a page component do following steps :

1.  Define base models or entites inside the @schema folder using TypeScript if you need any (optional):

    ```typescript
    export interface Todo {
      id: string
      done: boolean
      text: string
      visible: boolean
    }
    ```

2.  Define initialState and types:

    ```typescript
    type Filter = 'SHOW_COMPLETED' | 'SHOW_ALL'

    export interface SliceState extends EntityState<Todo> {
      isLoading: boolean
      error: string | undefined
      visibilityFilter: Filter
    }
    interface TodosPayload {
      data: Todo[]
    }

    const initialState: SliceState = {
      ...todosAdapter.getInitialState(),
      isLoading: false,
      error: '',
      visibilityFilter: 'SHOW_ALL',
    }
    ```

3.  Create basic slice:

    ```typescript
    export const sliceName = 'todos'
    const todosSlice = createSlice({
      name: sliceName, // A string name for this slice of state. Generated action type constants will use this as a prefix.
      initialState: initialState, // The initial state value for this slice of state.

      // An object containing Redux "case reducer" functions (functions intended to handle a specific action type, equivalent to a single case statement in a switch).
      reducers: {
        // This will create both reducer and actionCreator (setVisibilityFilter)
        setVisibilityFilter(state: SliceState, action: PayloadAction<Filter>) {
          state.visibilityFilter = action.payload
        },
      },
    })

    export const {setVisibilityFilter} = vendorsListSlice

    // In component:
    dispatch(setVisibilityFilter('SHOW_COMPLETED'))
    ```

    createSlice will return an object that looks like:

    ```typescript
    {
      name : string,
      reducer : ReducerFunction,
      actions : Record<string, ActionCreator>, // Action creators that is created automatically
      caseReducers: Record<string, CaseReducer>
    }
    ```

4.  Async actions:

    ```typescript
    export const fetchTodos = createAsyncThunk<
      TodosPayload,
      undefined,
      {rejectValue: string}
    >(`${sliceName}/fetchTodos`, async (
      args /* args that user provide */,
      {rejectWithValue}
    ) => {
      try {
        const todos = await fakeFetchTodos()
        return todos
      } catch (err) {
        return rejectWithValue(err.message)
      }
    })
    ```

    Update _createSlice_:

    ```typescript
    const todosSlice = createSlice({
      /* name ,initialState, reducers as above */,

      // extraReducers allows createSlice to respond to other action types besides the types it has generated.
      extraReducers: builder => {
        builder
          .addCase(fetchTodos.pending, state => {
            state.isLoading = true
            state.error = ''
          })
          .addCase(fetchTodos.fulfilled, (state, action) => {
            state.todos = action.payload.data
          })
          .addCase(fetchTodos.rejected, (state, action) => {
            state.isLoading = false
            if (action.payload) {
              state.error = action.payload
            } else {
              state.error = action.error.message
            }
          })
      },
    })

    // In component
    dispatch(fetchTodos())
    ```

5.  **Adapter**:
    A function that generates a set of prebuilt reducers and selectors for performing CRUD operations on a normalized state structure containing instances of a particular type of data object.

    ```typescript
    const todosAdapter = createEntityAdapter<Todo>()
    const todosSlice = createSlice({
      name: sliceName,
      initialState: todosAdapter.getInitialState(initialState),
      reducers: {
        setVisibilityFilter(state: SliceState, action: PayloadAction<Filter>) {
          state.visibiltyFilter = action.payload
        },
        // adapters
        addOne: todosAdapter.addOne,
        removeOne: todosAdapter.removeOne,
        updateOne: todosAdapter.updateOne,
        addMany: todosAdapter.addMany,
      },
      extraReducers: builder => {
        builder
          .addCase(fetchTodos.pending, state => {
            state.isLoading = true
            state.error = ''
          })
          .addCase(fetchTodos.fulfilled, (state, action) => {
            todosAdapter.addMany(state, action.payload.data)
          })
          .addCase(fetchTodos.rejected, (state, action) => {
            state.isLoading = false
            if (action.payload) {
              state.error = action.payload
            } else {
              state.error = action.error.message
            }
          })
      },
    })

    // All actions
    export const {
      setVisibilityFilter,
      addMany,
      addOne,
      removeOne,
      updateOne,
    } = todosSlice.actions

    // In component
    const newTodo = {
      id: '1',
      changes: {
        text: 'Updated',
        done: true,
      },
    }
    dispatch(updateOne(newTodo))
    dispatch(removeOne('2'))
    ```

6.  Selectors

    ```typescript
    // selectors
    export const sliceSelector = (state: StoreShape) =>
      state[todosSlice.name] as SliceState
    const globalizedSelectors = todosAdapter.getSelectors<StoreShape>(state =>
      sliceSelector(state)
    )
    export const {selectAll, selectById} = globalizedSelectors
    export const isLoadingSelector = createSelector(
      sliceSelector,
      state => state.isLoading
    )

    // In component
    const todos = useSelector(selectAll)
    const todosState = useSelector(sliceSelector)
    ```

7.  Store type safety and injecting reducer
    Add your types in store-types

    ```typescript
    export type StoreShape = {
      todos?: TodosSliceState
    }
    export type Reducers = {
      todos: Reducer<TodosSliceState, AnyAction>
    }

    // In your page component
    store.reducerManager!.add({todos: todosSlice.reducer})
    ```

    Example files:

        - src/sections/search/redux/example/todos.tsx
        - src/sections/search/redux/todosSlice.ts
        - src/sections/search/pages/restaurant.tsx

---

## Store Configuration and Code Splitting

Two classes are used to set up Redux store for the app.

- `StoreRepo` This class manages whether to make a new store or use cached store on multiple calls.

  Because the `App` component is after the `NextJs`'s router, the `getInitialProps` function will be called before each page. So the `redux`'s provider will be re-rendered on each page. In order not to rebuild the store, it will be kept in the `StoreRepo` class and used in subsequent renderings.

- `StoreFactory` The task is to build a completely fresh store based on the initial state.

  We use a `StoreFactory` to create a new store. To build the store as input, the initial state and the root reducer are given. The created store contains an object called the `reducerManager`. Which includes two methods of adding and removing reducers.

`./src/redux/StoreFactory/index.ts`

```typescript
// adding
store.reducerManager!.add({
  [sliceA.name]: sliceA.reducer,
  [sliceB.name]: sliceB.reducer,
})

// removing
store.reducerManager!.remove([sliceA.name, sliceB.name])
```

Before adding them, you must also add their types. So we have to add the shape of that slice to `StoreShape` and its reducer to `Reducers`.

`./src/redux/store-types.ts`

```typescript
export type AppActions = StaticActionType | LazyActionType

export type StoreShape = {
  staticState: StaticStateType
  'sectionA/lazyState'?: LazyStateType
}

export type Reducers = {
  staticState: Reducer<StaticStateType, StaticActionType>
  'sectionA/lazyState'?: Reducer<LazyStateType, LazyActionType>
}
```

It should be noted that lazy slices must be named as follows: `section-name/file-name`. This slice must be imported from the following folder: `./src/sections/section-name/redux/file-name`. Otherwise this file will not be found.

---

## API Client

To call an endpoint, you must first in the file `src/api/endpoints.ts` introduce the desired endpoint. To do this, enter the request settings in the field `apiConfigs`. These settings include the [Axis configuration](https://github.com/axios/axios#request-config) settings and the following settings:

```typescript
export interface APIConfig extends AxiosRequestConfig {
  key?: string
  type?: BodyTypes
  maxRetry?: number
  sectionKey?: string
  showErrorMessage?: boolean
  urlParams?: object
  staticParams?: {[key: string]: string}
}
```

For example, we add the following endpoint:

```typescript
  {
    key: 'vendorList',
    url: '/mobile/:version/:type/vendors-list',
    method: 'GET',
  }
```

After introducing the endpoint, we can call the API:

```typescript
const response = await API.requests.vendorList<APIResponse>({})
```

The `APIResponse` of the above snippet is the response output type.

**APIConfig**

- `key` It is the key by which we call the endpoint.
- `type` Type of payload. Which is one of these cases `form`, `json`.
- `maxRetry` Maximum retry in case of time out.
- `sectionKey` Unique key to specify each section
- `showErrorMessage` Whether an api-error was sent for this endpoint or not
- `url` The URL can be defined according to the [path-to-regex](https://github.com/pillarjs/path-to-regexp) package.
- `urlParams` Variable values defined in the `url` field.
- `staticParams` Query params values to be sent to all endpoints.

**Global configs**

In a few levels, you can change the configs of a group of endpoints.

1.  When making API Instance.
    APIFactory class takes two inputs. `Endpoints` and `APIConfig`. The second input (`APIConfig`) is optional and if not given, the default config are used.

         - src/api/api.config.ts

All configured values are changed in the next steps.

2. When new endpoints are added. In the `Endpoints` object, the `defaults` field can be added. The given configs replace the previous values only for this group of endpoints.
3. When defining an endpoint. In the `Endpoints` object all endpoints defined in the `apisConfig` overwrite their configurations with the previous values.
4. When calling an API

**Add endpoints**

New endpoints can be defined in two different ways.

1. When making API Instance.
2. Use the addEndpoints method after creating the instance.

For example, each section can have its own set of endpoints (note that each section must have its own unique `section` key) and dynamically add to the app's api instance.

```typescript
import api from '@api'
import endpoints from '~search/endpoints'

api.addEndpoints(endpoints)
```

**Add interceptors**

Like the add endpoints, new interceptors can be defined in two different ways.

1. When new endpoints are added. In the `Endpoints` object, the `interceptors` field contains interceptors that are applied to this group of endpoints.

```typescript
const endpoints: Endpoints = {
  section: 'example',
  apisConfig: [],
  interceptors: {
    force: true,
    response: [[responseFulfilled, responseRejected]],
    request: [[beforeRequestSent, requestError]],
  },
  defaults: {},
}
```

2. Use the addInterceptors method after creating the instance. This method takes two inputs, one is the key of the previously added group of endpoints and the other is the interceptors.

The `force` field determines whether these interceptors belong only to this group or should be applied to all endpoints.

Two inputs are injected into the interceptors, the second input of all of them is _Axios instance_, which can be _used to call another request_. But their first input is different, the request interceptors receive the endpoint configuration as the first input (both the interceptor before the request and after the error occurs). Successful response interceptor receives `APIResponse` and failed response interceptor receives `APIError` as first input.

See the [Axios](https://github.com/axios/axios#interceptors) document for more information.

For example, using the request interpreter, you can use it to change the configuration of endpoints or set a value in the headers. You can even keep all the requests pending.
