
module.exports = function (Shop) {
  /*
     Following section is for hiding write-related remoteMethods from the public.
     In this way, we only expose read-only operations on our model, and all
     POST, PUT, DELETE verbs are hidden.
   */
  // Remove (POST) /shops
  Shop.disableRemoteMethodByName('create')
  // Remove (Patch) /shops
  Shop.disableRemoteMethodByName('upsert')
  // Remove (POST) /shops/{id}/replace, (POST) /shops/replaceOrCreate
  Shop.disableRemoteMethodByName('replaceOrCreate')
  // Remove (DELETE) /shops/:id
  Shop.disableRemoteMethodByName('deleteById')
  // Remove (PUT) /shops/:id, (POST) /shops/:id/replace
  Shop.disableRemoteMethodByName('replaceById')
  // Remove (POST) /shops/update
  Shop.disableRemoteMethodByName('updateAll')
  // Remove (PATCH) /shops/:id
  Shop.disableRemoteMethodByName('prototype.updateAttributes')
  // Remove (GET|POST) /shops/change-stream
  Shop.disableRemoteMethodByName('createChangeStream')
  // Remove (POST) /shops/upsertWithWhere
  Shop.disableRemoteMethodByName('upsertWithWhere')

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
