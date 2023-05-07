import type { App } from "vue";
import Timeline from "./components/Timeline.vue";

export * from "./components/types";

Timeline.install = (app: App) => {
	app.component(Timeline.name, Timeline);
};

export default Timeline;
