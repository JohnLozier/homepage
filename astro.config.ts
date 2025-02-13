import { defineConfig } from "astro/config";
import relativeLinks from "astro-relative-links";
import solid from "@astrojs/solid-js";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
	server: {
		port: 3000
	},
	devToolbar: {
		enabled: false
	},
	prefetch: {
		prefetchAll: true
	},
	integrations: [solid(), relativeLinks()],
	vite: {
		plugins: [
			tailwind()
		]
	},
	build: {
		assets: "assets"
	},
	outDir: "./dist",
	output: "static"
});