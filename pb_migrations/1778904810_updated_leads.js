/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text999008199",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "number1932552099",
    "max": null,
    "min": null,
    "name": "phone",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_729954569")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text999008199",
    "max": 0,
    "min": 0,
    "name": "Name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "number1932552099",
    "max": null,
    "min": null,
    "name": "Phone_number",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
