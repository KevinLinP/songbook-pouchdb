<script>
	import Router from 'svelte-spa-router'
	import SongsPage from './SongsPage.svelte'

	const routes = {
		'/': SongsPage,
		'/:slug': SongsPage,
	}
</script>

<div class="container">
	<Router {routes}/>
</div>