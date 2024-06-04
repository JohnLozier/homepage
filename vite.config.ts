import SolidJS from "vite-plugin-solid";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	plugins: [
		SolidJS(),
		viteSingleFile()
	],
	build: {
		outDir: "dist"
	}
});