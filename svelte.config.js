import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			server: {
				proxy: {
					'/wp-json': {
						target: 'https://ison.gr',
						changeOrigin: true,
						rewrite: (path) => path.replace(/^\/wp-json/, '/wp-json')
					}
				}
			}
		}
	}
};

export default config;
