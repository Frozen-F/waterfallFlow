<template>
  <div ref="waterfallFlowWrapperItemEL" class="waterfallFlowWrapperItem">
    <div v-if="config.isFixedHeight" class="fixedHeightWrapper">
      <div
        v-for="(item, index) in props.list"
        :key="index"
        class="itemWrapper"
        :style="{
          height: config.style.height,
          width: `${(config.height * item.width) / item.height}px`
        }"
      >
        <slot :item="item"></slot>
      </div>
    </div>
    <div
      v-else
      class="fixedWidthWrapper"
      :class="{ hidden: fixedWidthConfig.loading }"
    >
      <div v-for="(lane, laneI) in fixedWidthConfig.laneList" :key="laneI">
        <div
          v-for="(item, index) in lane"
          :key="index"
          class="itemWrapper fixedWidthItem"
          :style="{
            width: config.style.width,
            height: `${props.isAutoHeight ? 'auto' : (config.width * item.height) / item.width}px`
          }"
        >
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  reactive,
  onMounted,
  onBeforeUnmount,
  nextTick,
  ref,
  watch
} from 'vue';
import { getELStyle } from './util.ts';
defineComponent({ name: 'BitWaterfallFlow' });

interface ListItem {
  height: number; // fixedWidth
  width: number; // fixedHeight
  [key: string]: any;
}

const props = defineProps({
  type: {
    type: String as PropType<'fixedWidth' | 'fixedHeight'>,
    required: false,
    default: 'fixedHeight'
  },
  list: {
    type: Array as PropType<ListItem[]>,
    required: false,
    default: () => []
  },
  // fixedHeight 时传
  height: {
    type: Number,
    required: false,
    default: 200
  },
  // fixedWidth 时传
  width: {
    type: Number,
    required: false,
    default: 200
  },
  // 性能慢最好先不用
  isAutoHeight: {
    type: Boolean,
    required: false,
    default: false
  }
});

const waterfallFlowWrapperItemEL = ref<HTMLDivElement>();
const laneNum = ref(1);
const config = computed(() => {
  return {
    isFixedWidth: props.type === 'fixedWidth',
    isFixedHeight: props.type === 'fixedHeight',
    style: {
      height: `${props.height}px`,
      width: `${props.width}px`
    },
    height: props.height,
    width: props.width
  };
});

const fixedWidthConfig = reactive<{
  laneList: ListItem[][];
  loading: boolean;
}>({
  laneList: [],
  loading: false
});

const initLaneList = () => {
  if (props.type === 'fixedHeight') return;
  nextTick(() => {
    const { width } = getELStyle(waterfallFlowWrapperItemEL);
    laneNum.value = Math.floor(width / (props.width + 10)) || 1;
    fixedWidthConfig.loading = true;
    const lanePosition = new Array(laneNum.value).fill(0);
    const { list } = props;
    if (props.isAutoHeight) {
      fixedWidthConfig.laneList = [[...list]];
      // fixedWidthConfig.laneList = new Array(laneNum.value).fill(0).map(() => []);
      // list.forEach((item, index) => {
      //   const laneI = (index + 1) % laneNum.value;
      //   fixedWidthConfig.laneList[laneI].push(item);
      // });
      setTimeout(() => {
        parseLaneList(lanePosition);
        fixedWidthConfig.loading = false;
      }, 500);
    } else {
      const res: ListItem[][] = new Array(laneNum.value).fill(0).map(() => []);
      list.forEach((item: ListItem, index) => {
        const _minPosi = Math.min(...lanePosition);
        const _minPosiIndex = lanePosition.indexOf(_minPosi);
        lanePosition[_minPosiIndex] += (config.value.width * item.height) / item.width;
        res[_minPosiIndex].push(item);
      });
      fixedWidthConfig.laneList = res;
      fixedWidthConfig.loading = false;
    }
  });
};

watch(
  () => props.list,
  () => {
    initLaneList();
  },
  {
    immediate: true,
    deep: true
  }
);

onMounted(() => {
  window.addEventListener('resize', initLaneList);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', initLaneList);
});

const parseLaneList = (lanePosition: number[]) => {
  const { list } = props;
  const res: ListItem[][] = new Array(laneNum.value).fill(0).map(() => []);
  Array.from(document.querySelectorAll('.fixedWidthItem')).forEach((item: Element, index) => {
    const _height = item['offsetHeight'];
    const _minPosi = Math.min(...lanePosition);
    const _minPosiIndex = lanePosition.indexOf(_minPosi);
    lanePosition[_minPosiIndex] += _height;
    res[_minPosiIndex].push(list[index]);
  });
  fixedWidthConfig.laneList = res;
};
</script>

<style lang="scss" scoped>
$gap: 8px;
.waterfallFlowWrapperItem {
  width: 100%;
  .fixedHeightWrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: $gap;
    .itemWrapper {
      flex-grow: 1;
    }
    &::after {
      content: '';
      flex-grow: 999999999;
    }
  }
  .fixedWidthWrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: $gap;
    justify-content: center;
    .itemWrapper {
      margin-bottom: $gap;
      height: auto;
    }
  }
  .hidden {
    visibility: hidden;
  }
}
</style>
