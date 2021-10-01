/* eslint-disable no-undef */
const http = require('http')
const url = require('url')
const { join } = require('path')
const CarService = require('../service/carService')
const BaseRepository = require('../repository/base/baseRepository')

const custumerFile = join(__dirname, './../../database', 'customers.json')
const carDatabase = join(__dirname, './../../database', 'cars.json')
const carCategoryFile = join(
  __dirname,
  './../../database',
  'carCategories.json'
)

const carService = new CarService({ cars: carDatabase })
const carCategoryRepository = new BaseRepository({ file: carCategoryFile })
const customerRepository = new BaseRepository({ file: custumerFile })

const routes = {
  '/rent:get': async (request, response) => {
    const { carCategoryId, customerId, numberOfDays } = url.parse(
      request.url,
      true
    ).query

    const isQueryParamsValid = carCategoryId || customerId || numberOfDays

    const carCategory = await carCategoryRepository.find(carCategoryId)
    const customer = await customerRepository.find(customerId)

    const days = Number(numberOfDays)

    if (
      !isQueryParamsValid ||
      !carCategory ||
      !customer ||
      !Number.isInteger(days)
    ) {
      return routes.invalidParameters(request, response)
    }

    const transaction = await carService.rent({
      carCategory,
      numberOfDays: days,
      customer,
    })

    response.writeHead(200, {
      // 'Content-Type': 'text/html',
      'Content-Type': 'json/javascript',
    })
    response.write(JSON.stringify(transaction))

    return response.end()
  },
  invalidParameters: (request, response) => {
    response.writeHead(400, {
      'Content-Type': 'text/html',
    })
    response.write(JSON.stringify({ error: 'Invalid parameters!' }))
    return response.end()
  },
  default: (request, response) => {
    response.writeHead(404, {
      'Content-Type': 'text/html',
    })
    return response.end()
  },
}

const handler = function (request, response) {
  const { method } = request

  const { pathname } = url.parse(request.url, true)

  const routeKey = `${pathname}:${method.toLowerCase()}`

  const chosen = routes[routeKey] || routes.default

  response.writeHead(200, {
    'Content-Type': 'text/html',
  })

  return chosen(request, response)
}

const app = http
  .createServer(handler)
  .listen(3000, () => console.log('app running at', 3000))

module.exports = { app, routes }
