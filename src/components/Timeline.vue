<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";

import resizeObserver from "@/utils/resize-observer";

import type { TimelineItemProps } from "./types";

const props = withDefaults(
	defineProps<{
		data: TimelineItemProps[];
		theme?: string;
		textColor?: string;
		dividerLabel?: (time: string) => string;
	}>(),
	{
		theme: "lightgray",
		textColor: "#000",
	}
);

const sortedList = computed(() =>
	props.data
		.reduce((a: TimelineItemProps[], b) => {
			const time = new Date(b.time).getFullYear().toString();
			if (
				!a.find(
					(item: TimelineItemProps) =>
						new Date(item.time).getFullYear().toString() == time
				)
			)
				a.push({ time, divider: true });
			a.push(b);
			return a;
		}, new Array())
		.sort((a, b) => {
			return new Date(a.time).getTime() - new Date(b.time).getTime();
		})
);

const cssVars = computed(() => ({
	"--tree-like-timeline-vue3_theme": props.theme,
	"--tree-like-timeline-vue3_text-color": props.textColor,
}));

const yearFilter = (time: string) => {
	const date = new Date(time);
	return props.dividerLabel?.call(null, time) ?? date.getFullYear();
};

const timelineRef = ref<HTMLElement | null>(null);

const is_mobile = ref(false);

onMounted(() => {
	nextTick(() => {
		if (timelineRef.value) {
			resizeObserver(timelineRef.value, {
				onInit: (el) => {
					is_mobile.value = el.clientWidth < 768;
				},
				onResizing: (entry) => {
					is_mobile.value = entry.contentRect.width < 768;
				},
			});
		}
	});
});
</script>

<template>
	<section ref="timelineRef" class="tree-like-timeline-vue3" :style="cssVars">
		<div class="tree-like-timeline-vue3__nodes">
			<template v-for="(item, i) in sortedList" :key="`${item.time}-${i}`">
				<span
					v-if="item.divider"
					:data-year="yearFilter(item.time)"
					class="tree-like-timeline-vue3__node_divider"
				/>
				<div
					v-else
					:style="{ marginTop: is_mobile ? '' : item.offsetTop }"
					class="tree-like-timeline-vue3__node_item"
					ref="tree-like-timeline-vue3__node_item"
				>
					<slot :item="item" :index="i">{{ item }}</slot>
				</div>
			</template>
		</div>
	</section>
</template>

<style lang="scss" scoped>
$--tree-like-timeline-vue3_connect_line: 5em; // 左右兩邊與中間連接線之寬度
$--tree-like-timeline-vue3_divider_size: 4em; // 年份分界節點之寬高
$--tree-like-timeline-vue3_point_size: 1em; // 左右兩邊對中線的圓點之寬高
.tree-like-timeline-vue3 {
	padding: 0;
	position: relative;
	margin-top: #{$--tree-like-timeline-vue3_divider_size * 0.5} !important;

	// 中線
	&::before {
		content: "";
		display: block;
		height: 100%;
		width: 1px;
		background: var(--tree-like-timeline-vue3_theme);
		position: absolute;
		top: 0;
		left: 50%;
		height: 100%;
		transform: translateX(-50%);
		@media screen and (max-width: 768px) {
			transform: none;
			left: #{$--tree-like-timeline-vue3_divider_size * 0.5};
		}
	}

	// 年份節點
	.tree-like-timeline-vue3__node_divider {
		clear: both;
		width: 100%;
		display: block;
		position: relative;

		&::after {
			content: attr(data-year);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: $--tree-like-timeline-vue3_divider_size;
			height: $--tree-like-timeline-vue3_divider_size;
			border-radius: 100%;
			background: var(--tree-like-timeline-vue3_theme);
			color: var(--tree-like-timeline-vue3_text-color);
			display: flex;
			align-items: center;
			justify-content: center;

			@media screen and (max-width: 768px) {
				left: 0;
				transform: translateY(-50%);
			}
		}
	}

	// 節點
	.tree-like-timeline-vue3__node_item {
		position: relative;
		width: calc(50% - #{$--tree-like-timeline-vue3_connect_line});

		&:not(:last-child) {
			margin-bottom: 20px;
		}

		// 左右兩邊對中線的連接線
		&::before {
			content: "";
			display: block;
			width: $--tree-like-timeline-vue3_connect_line;
			height: 2px;
			background: var(--tree-like-timeline-vue3_theme);
			position: absolute;
			top: 30%;
			transform: translateY(-50%);
		}

		// 左右兩邊對中線的圓點
		&::after {
			content: "";
			box-sizing: border-box;
			display: block;
			width: $--tree-like-timeline-vue3_point_size;
			height: $--tree-like-timeline-vue3_point_size;
			background: #fff;
			color: #fff;
			border: 3px solid var(--tree-like-timeline-vue3_theme);
			position: absolute;
			top: 30%;
			transform: translateY(-50%);
			border-radius: 100%;
		}

		// 左邊
		&:nth-of-type(even) {
			float: left;
			clear: left;

			// 左邊連接線
			&::before {
				left: 100%;
			}
			// 左邊對中線的圓點
			&::after {
				left: calc(
					100% + #{$--tree-like-timeline-vue3_connect_line -
						$--tree-like-timeline-vue3_point_size * 0.5}
				);
			}
		}

		// 右邊
		&:nth-of-type(odd) {
			float: right;
			clear: right;

			// 右邊連接線
			&::before {
				right: 100%;
			}
			// 右邊對中線的圓點
			&::after {
				right: calc(
					100% + #{$--tree-like-timeline-vue3_connect_line -
						$--tree-like-timeline-vue3_point_size * 0.5}
				);
			}
		}

		@media screen and (max-width: 768px) {
			width: calc(100% - #{$--tree-like-timeline-vue3_connect_line});
			float: right !important;

			// 全部對中線的連接線
			&::before {
				left: unset !important;
				right: 100% !important;
				width: #{$--tree-like-timeline-vue3_connect_line -
					($--tree-like-timeline-vue3_divider_size * 0.5)};
			}

			// 全部對中線的圓點
			&::after {
				left: unset !important;
				right: calc(
					100% + #{$--tree-like-timeline-vue3_connect_line -
						$--tree-like-timeline-vue3_divider_size * 0.5 -
						$--tree-like-timeline-vue3_point_size * 0.5}
				) !important;
			}
		}
	}

	// 最後清除 float
	&::after {
		content: "";
		display: block;
		clear: both;
	}
}
</style>
