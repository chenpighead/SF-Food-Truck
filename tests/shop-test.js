
const app = require('../server/server')
require('should')
const request = require('supertest')(app)

describe('API Shop tests', function () {
  before(async function () {
    const Shop = app.models.Shop
    await Shop.create({ name: 'shop1' })
    await Shop.create({ name: 'shop2' })
    await Shop.create({ name: 'shop3' })
  })

  it('should create a shop', function (done) {
    const name = 'shop1'
    request
      .post('/api/shops')
      .send({ name: name })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        console.log(res.body)

        res.body.name.should.equal(name)

        done()
      })
  })

  it('should get shops', function (done) {
    request
      .get('/api/shops')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        console.log(res.body)
        done()
      })
  })
})

// add integration test
