
module.exports = function (Shop) {
  Shop.nearby = async function (name, lat, lon) {
    // Reference location for getting nearby shops. We use Uber HQ for now,
    // but can be modified to user's current location.
    var userLocation = { lat: 37.7811489, lng: -122.4579986 }
    let result = await Shop.find({
      '$text': {
        search: name
      },
      where: {
        geoLocation: {
          near: userLocation,
          maxDistance: 2,
          unit: 'kilometers'
        },
        Status: 'APPROVED'
      }
    })
    return result
  }
  Shop.remoteMethod('nearby', {
    accepts: [
      { arg: 'name', type: 'string' },
      { arg: 'lat', type: 'number' },
      { arg: 'lon', type: 'number' }],
    returns: { type: 'array', root: true },
    http: { verb: 'get' }
  })
}
