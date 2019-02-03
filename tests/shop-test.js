
const app = require('../server/server')
require('should')
const request = require('supertest')(app)

/*
 * Test the /POST, /PUT, /DELETE route
 * XXX: These tests are skipped for now since we hide these APIs at the moment.
 */
describe.skip('API Shop POST/PUT/DELETE tests', function () {
  it('should create a shop', function (done) {
    const name = 'shop1'
    request
      .post('/api/shops')
      .send({ name: name })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        res.body.name.should.equal(name)
        done()
      })
  })
})

/*
 * Test the /GET route
 */
describe('API Shop GET tests', function () {
  before(async function () {
    const Shop = app.models.Shop
    await Shop.create({ name: 'shop1' })
    await Shop.create({ name: 'shop2' })
    await Shop.create({ name: 'shop3' })
  })

  it('should get shops', function (done) {
    request
      .get('/api/shops')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        res.body[0].name.should.equal('shop1')
        res.body[1].name.should.equal('shop2')
        res.body[2].name.should.equal('shop3')
        done()
      })
  })
})

// add integration test
