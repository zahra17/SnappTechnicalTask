module.exports = new Set()
  .add({pattern: '/', page: '/home'})
  .add({pattern: '/service/[service]/city/[cityName]', page: 'vendor-list'})
  .add({
    pattern: '/service/[service]/city/[cityName]/area/[areaName]',
    page: 'vendor-list',
  })
  .add({
    pattern: '/service/vendor-collection/[vc]',
    page: 'vendor-list',
  })
  .add({
    pattern: '/cuisine/[cuisine]',
    page: 'vendor-list',
  })
  .add({
    pattern: '/service/[service]/city/[cityName]/near',
    page: 'vendor-list',
  })
  .add({pattern: '/service/[service]', page: 'vendor-list'})
  .add({pattern: '/service/[service]/chain/[chainName]', page: 'vendor-list'})

  .add({pattern: '/search', page: 'search'})
  .add({pattern: '/products', page: 'products'})
  .add({pattern: '/profile', page: 'profile'})
