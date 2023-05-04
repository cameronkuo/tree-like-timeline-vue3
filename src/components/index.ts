import type { App } from "vue";

import Timeline from "./Timeline.vue";

Timeline.install = function (Vue: App) {
	Vue.component("tree-like-timeline-vue3", Timeline);
};

export default Timeline;
