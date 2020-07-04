<script>
  import PouchDB from 'pouchdb-browser'
  import SongSelect from './SongSelect.svelte'
  import Song from './Song.svelte'
  
  export let params = {}

	const db = new PouchDB('songs')
	const remoteDb = new PouchDB('http://localhost:5984/songs')
	db.replicate.from(remoteDb).on('complete', () => {
    refresh()
  })

  let songs = []
  let song = null

	async function refresh() {
    const allDocs = await db.allDocs({
      include_docs: true
    })
    songs = allDocs.rows.map(row => row.doc)
  }
	refresh()

  $: currentSongId = params.songId
  $: {
    if (currentSongId) {
      db.get(currentSongId).then((doc) => {
        song = doc
      })
    } else {
      song = null
    }
  }
</script>

<div class="my-3">
  <SongSelect {songs}/>
</div>

{#if currentSongId}
  {#if song}
    <Song song={song}/>
  {/if}
{:else}
  <header class="mt-4 mb-4">
    <h1 class="display-5">Hash House Harriers Songbook</h1>
  </header>

  <p class="mb-5">Search to begin.</p>
  <p class="text-muted">Add this page to your homescreen and your phone will try to remember the songs for a few days.</p>
{/if}