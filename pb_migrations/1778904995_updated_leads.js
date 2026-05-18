/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // update collection data
  unmarshal({
    "name": "submissions"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // update collection data
  unmarshal({
    "name": "leads"
  }, collection)

  return app.save(collection)
})
