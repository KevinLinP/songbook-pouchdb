<script>
  import { fade } from 'svelte/transition';
  import PouchDB from 'pouchdb-browser'
  import PouchDBAdapterMemory from 'pouchdb-adapter-memory'
  PouchDB.plugin(PouchDBAdapterMemory)
  import PouchDBFind from 'pouchdb-find'
  PouchDB.plugin(PouchDBFind)
  import SongSelect from './SongSelect.svelte'
  import Song from './Song.svelte'

  export let params = {}
  let songs = []
  let song = null
  let loading = false

  const db = new PouchDB('pages', {adapter: 'memory'})
  db.createIndex({index: {fields: ['slug']}})
  const persistedDb = new PouchDB('pages')
  const remoteDb = new PouchDB('http://localhost:5984/pages')

  persistedDb.info().then((info) => {
    if (info.doc_count === 0) {
      loading = true
    }
  })
	db.replicate.from(persistedDb, {live: true}).on('change', () => {
    loadSong()
    loadSongs()
  })
	persistedDb.replicate.from(remoteDb).on('complete', async () => {
    // TODO: think about this
    loading = false
  })


	async function loadSongs() {
    const allDocs = await db.allDocs({
      include_docs: true
    })

    songs = allDocs.rows.reduce((acc, result) => {
      if (result.doc.slug) {
        acc.push(result.doc)
      }
      return acc
    }, [])
  }
  loadSongs()

  async function loadSong() {
    if (currentSongId) {
      const result = await db.find({selector: {slug: currentSongId}})
      song = result.docs[0]
    } else {
      song = null
    }
  }

  $: currentSongId = params.songId
  $: {
    currentSongId
    loadSong()
  }
</script>

<div class="my-3">
  <SongSelect {songs}/>
</div>

{#if currentSongId}
  {#if song}
    <Song song={song}/>
  {:else}
    {#if loading}
      <span class="text-muted" in:fade>loading ...</span>
    {/if}
  {/if}
{:else}
  <header class="mt-4 mb-4">
    <h1 class="display-5">Hash House Harriers Songbook</h1>
  </header>

  <p class="mb-5">Search to begin.</p>
  <p class="text-muted">Add this page to your homescreen and your phone will try to remember the songs for a few days.</p>
{/if}