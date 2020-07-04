<script>
  import PouchDB from 'pouchdb-browser'
  import PouchDBFind from 'pouchdb-find'
  PouchDB.plugin(PouchDBFind)
  import SongSelect from './SongSelect.svelte'
  import Song from './Song.svelte'

  export let params = {}
  let songs = []
  let song = null
  let loading = true

  const db = new PouchDB('pages')
  db.createIndex({index: {fields: ['slug']}})

  const remoteDb = new PouchDB('http://localhost:5984/pages')
	db.replicate.from(remoteDb).on('complete', async () => {
    await loadSong()
    await loadSongs()
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
      <span class="text-muted">loading ...</span>
    {/if}
  {/if}
{:else}
  <header class="mt-4 mb-4">
    <h1 class="display-5">Hash House Harriers Songbook</h1>
  </header>

  <p class="mb-5">Search to begin.</p>
  <p class="text-muted">Add this page to your homescreen and your phone will try to remember the songs for a few days.</p>
{/if}