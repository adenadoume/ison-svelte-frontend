import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/graphql': {
				target: 'https://your-wordpress-site.com',
				changeOrigin: true,
				secure: false,
			}
		}
	}
});