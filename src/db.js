  import PouchDB from 'pouchdb-browser'
  import PouchDBFind from 'pouchdb-find'
  PouchDB.plugin(PouchDBFind)

  const db = new PouchDB('pages')

  db.createIndex({index: {fields: ['slug']}})

  const remoteDb = new PouchDB('http://localhost:5984/pages')
	db.replicate.from(remoteDb).on('complete', () => {
    refresh()
  })

  export default db