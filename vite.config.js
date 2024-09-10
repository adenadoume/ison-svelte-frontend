import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/graphql': {
				target: 'https://ison.gr',
				changeOrigin: true,
				secure: false,
			}
		}
	}
});