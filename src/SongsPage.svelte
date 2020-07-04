<script>
  import _ from 'lodash'
  import { fade } from 'svelte/transition';
  import PouchDB from 'pouchdb-browser'
  import SongSelect from './SongSelect.svelte'
  import Song from './Song.svelte'
  import { params } from 'svelte-hash-router'

  let songs = {}
  let loading = false

  const db = new PouchDB('pages')
  const remoteDb = new PouchDB('http://localhost:5984/pages')

  db.info().then((info) => {
    if (info.doc_count === 0) {
      loading = true
    }
  })
	db.replicate.from(remoteDb).on('complete', async () => {
    loading = false
    loadSongs()
  })

	async function loadSongs() {
    const allDocs = await db.allDocs({
      include_docs: true
    })

    songs = allDocs.rows.reduce((acc, result) => {
      const doc = result.doc
      const slug = doc.slug
      if (slug) {
        acc[slug] = doc
      }
      return acc
    }, {})
  }
  loadSongs()

  function createSongOptions(songs) {
    let options = _.reduce(songs, (acc, s) => {
      acc.push(_.pick(s, ['title', 'slug']))
      return acc
    }, [])

    return _.sortBy(options, ['title'])
  }

  $: slug = $params.slug
  $: song = songs[slug]
  $: songSelectOptions = createSongOptions(songs)
</script>

<div class="my-3">
  <SongSelect songOptions={songSelectOptions}/>
</div>

{#if slug}
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