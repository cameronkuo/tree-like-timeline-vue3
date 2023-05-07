import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		lib:
			mode === "lib"
				? {
						// Could also be a dictionary or array of multiple entry points
						entry: resolve(__dirname, "src/index.ts"),
						name: "TreeLikeTimelineVue3",
						// name: "tree-like-timeline-vue3",
						// the proper extensions will be added
						fileName: "index",
				  }
				: false,
		rollupOptions:
			mode === "lib"
				? {
						// make sure to externalize deps that shouldn't be bundled
						// into your library
						external: ["vue"],
						output: {
							// Provide global variables to use in the UMD build
							// for externalized deps
							globals: {
								vue: "Vue",
							},
						},
				  }
				: undefined,
	},
}));
