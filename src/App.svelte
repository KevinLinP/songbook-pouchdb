<script>
	import Router from 'svelte-spa-router'
	import SongsPage from './SongsPage.svelte'

	const routes = {
		'/': SongsPage,
		'/:songId': SongsPage,
	}
</script>

<div class="container">
	<Router {routes}/>
</div>