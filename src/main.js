import 'bootstrap/dist/css/bootstrap.min.css';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

import { routes } from 'svelte-hash-router'
import App from './App.svelte';
import SongsPage from './SongsPage.svelte'
routes.set({
	'/': SongsPage,
	'/:slug': SongsPage,
})

const app = new App({
	target: document.body,
});

window.app = app;

export default app;