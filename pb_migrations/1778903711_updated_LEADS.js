/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3065852031",
    "max": 0,
    "min": 0,
    "name": "message",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // remove field
  collection.fields.removeById("text3065852031")

  return app.save(collection)
})
