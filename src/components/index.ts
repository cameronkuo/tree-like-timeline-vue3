import type { App } from "vue";
import Timeline from "./Timeline.vue";

Timeline.install = (app: App) => {
  app.component(Timeline.name, Timeline);
};

export * from "./timeline";
export * from "./Timeline.vue";

export default Timeline;
