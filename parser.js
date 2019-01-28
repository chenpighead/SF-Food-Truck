
const raw = require('foodtruck-rows.json')
const axios = require('axios')

const columns = raw.meta.view.columns
const names = columns.map((column) => {
  return column.name
})
const data = raw.data

// console.log(names);
for (let item of data) {
  let object = {}
  for (let i = 0; i < names.length; i++) {
    if (names[i] === 'id') {
      object['uuid'] = item[i]
    } else {
      object[names[i]] = item[i]
    }
  }

  axios
    .post('http://localhost:3000/api/shops', object)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}
