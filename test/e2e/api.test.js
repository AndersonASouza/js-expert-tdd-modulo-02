const { describe, it } = require('mocha')
const request = require('supertest')
const { app, routes } = require('../../src/api/api')
const assert = require('assert')

const INVALID_PARAMETERS = JSON.stringify({ error: 'Invalid parameters!' })

const fiveDays = '5'

const invalidTwoQueryParams =
  'carCategoryId=49eb95ad-95f3-445e-8480-0e9469fc3fab&customerId=f9ac5dfb-1e0c-450a-8c9d-d47e3879e0cc'

const invalidNumberOfDaysQueryParams =
  'carCategoryId=49eb95ad-95f3-445e-8480-0e9469fc3fab&customerId=f9ac5dfb-1e0c-450a-8c9d-d47e3879e0cc&numberOfDays=wrong'

const invalidCarCategoryQueryParams =
  'carCategoryId=invalid&customerId=f9ac5dfb-1e0c-450a-8c9d-d47e3879e0cc&numberOfDays=5'

const invalidCustomerIdQueryParams =
  'carCategoryId=49eb95ad-95f3-445e-8480-0e9469fc3fab&customerId=invalid&numberOfDays=5'

const onlyCustomerIdQueryParam = 'customerId=invalid'
const onlyNumberOfDaysQueryParam = 'numberOfDays=5'

// const invalidCustomerIdQueryParams =
//   'carCategoryId=49eb95ad-95f3-445e-8480-0e9469fc3fab&customerId=invalid&numberOfDays=5'

const validQueryParams = `carCategoryId=49eb95ad-95f3-445e-8480-0e9469fc3fab&customerId=f9ac5dfb-1e0c-450a-8c9d-d47e3879e0cc&numberOfDays=${fiveDays}`

describe('API Suite test', () => {
  describe('/rent', () => {
    it('should return Http Status 400 and "invalid parameters" when at least one of the mandatory parameters is missing', async () => {
      var response = await request(app).get(`/rent`).expect(400)

      assert.deepStrictEqual(response.text, INVALID_PARAMETERS)
    })
    it('should return Http Status 400 and "invalid parameters" when numberOfDays is not a integer number', async () => {
      const response = await request(app)
        .get(`/rent?${invalidNumberOfDaysQueryParams}`)
        .expect(400)

      assert.deepStrictEqual(response.text, INVALID_PARAMETERS)
    })
    it('should return Http Status 400 and "invalid parameters" when carCategory or customerId doesnt exist in database', async () => {
      const carCategoryInvalidResponse = await request(app)
        .get(`/rent?${invalidCarCategoryQueryParams}`)
        .expect(400)

      const customerIdInvalidResponse = await request(app)
        .get(`/rent?${invalidCustomerIdQueryParams}`)
        .expect(400)

      assert.deepStrictEqual(
        carCategoryInvalidResponse.text,
        INVALID_PARAMETERS
      )
      assert.deepStrictEqual(customerIdInvalidResponse.text, INVALID_PARAMETERS)
    })

    it('should return Http Status 200 and a transaction with the data of car, custumer and amount value and due date based in parameters entry', async () => {
      const response = await request(app)
        .get(`/rent?${validQueryParams}`)
        .expect(200)
      assert.deepStrictEqual(response.status, 200)
    })
  })
  describe('not found routes', () => {
    it('should return Http Status 404 when an inexistent route is accessed', async () => {
      const response = await request(app).get(`/invalid-route`).expect(404)

      assert.deepStrictEqual(response.status, 404)
    })
  })
})
