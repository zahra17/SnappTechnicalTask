import {SectionConfig, api, APIConfig} from '@api'

const basket: SectionConfig = {
  section: 'basket',
  defaults: {
    transformRequest: data => JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  },
  interceptors: {
    response: [],
    request: [],
  },
}

const creator = api.requestCreator(basket)

const updateBasket = creator({
  key: 'updateBasket',
  url: '/mobile/v2/basket/:id',
  method: 'PUT',
  staticParams: {fullResponse: '1'},
})

const createBasket = creator({
  key: 'createBasket',
  url: '/mobile/v2/basket/',
  method: 'POST',
  staticParams: {fullResponse: '1'},
})

const deleteBasket = creator({
  key: 'deleteBasket',
  url: '/mobile/v2/basket/:id',
  method: 'DELETE',
})

const requests = {
  updateBasket: <D>(config: APIConfig) => {
    return config.urlParams?.id
      ? updateBasket<D>(config)
      : createBasket<D>(config)
  },
  deleteBasket,
}

export default requests
