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
      v-else-if="config.isFixedWidth"
      v-loading="fixedWidthConfig.loading"
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
    <div v-else-if="config.isRowFixedHeight" class="rowFixedHeight">
      <div
        v-for="(item, index) in rowFixedHeightConfig.list"
        :key="index"
        :style="{
          display: 'inline-block',
          height: `${item['height']}px`,
          width: `${item['width']}px`
        }"
      >
        <slot :item="item"></slot>
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
defineComponent({ name: 'waterfallFlowWrapperItem' });

interface ListItem {
  height: number; // fixedWidth
  width: number; // fixedHeight
  [key: string]: any;
}

const props = defineProps({
  type: {
    type: String as PropType<'fixedWidth' | 'fixedHeight' | 'rowFixedHeight'>,
    required: false,
    default: 'fixedHeight'
  },
  list: {
    type: Array as PropType<ListItem[]>,
    required: false,
    default: () => []
  },
  // ['fixedHeight']
  height: {
    type: Number,
    required: false,
    default: 200
  },
  // ['fixedWidth']
  width: {
    type: Number,
    required: false,
    default: 200
  },
  // ['fixedWidth'] 性能慢最好先不用
  isAutoHeight: {
    type: Boolean,
    required: false,
    default: false
  },
  // ['rowFixedHeight']
  maxWidth: {
    type: Number,
    required: false,
    default: 400
  },
  gap: {
    type: Number,
    required: false,
    default: 8
  }
});

const waterfallFlowWrapperItemEL = ref<HTMLDivElement>();
const laneNum = ref(1);
const config = computed(() => {
  return {
    isFixedWidth: props.type === 'fixedWidth',
    isFixedHeight: props.type === 'fixedHeight',
    isRowFixedHeight: props.type === 'rowFixedHeight',
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

const rowFixedHeightConfig = reactive<{
  list: ListItem[];
}>({
  list: []
});

watch(
  () => props.list,
  async() => {
    await nextTick();
    parseData();
  },
  {
    immediate: true,
    deep: true
  }
);
watch(
  () => props.type,
  async() => {
    await nextTick();
    parseData();
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(() => {
  window.addEventListener('resize', parseData);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', parseData);
});

const parseData = () => {
  const { isFixedWidth, isRowFixedHeight } = config.value;
  const { list, width, gap, isAutoHeight, maxWidth } = props;
  if (isFixedWidth) {
    getFixedWidthData({ list: JSON.parse(JSON.stringify(list)), width, gap, isAutoHeight });
  } else if (isRowFixedHeight) {
    getRowFixedHeightData({ list: JSON.parse(JSON.stringify(list)), maxWidth, gap });
  }
};

// ------------------------解析固宽数据------------------------
const getFixedWidthData = ({
  list = [],
  width,
  gap,
  isAutoHeight
}: {
  list: ListItem[];
  width: number;
  gap: number;
  isAutoHeight: boolean;
}) => {
  if (!config.value.isFixedWidth) return;
  nextTick(() => {
    const { width: boxWidth } = getELStyle(waterfallFlowWrapperItemEL);
    laneNum.value = Math.floor(boxWidth / (width + gap)) || 1;
    fixedWidthConfig.loading = true;
    const lanePosition = new Array(laneNum.value).fill(0);
    if (isAutoHeight) {
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

const getRowFixedHeightData = async ({
  list = [],
  maxWidth,
  gap
}: {
  list: ListItem[];
  maxWidth: number;
  gap: number;
}) => {
  await nextTick();
  const res: any = [];
  const { width: boxWidth } = getELStyle(waterfallFlowWrapperItemEL);
  const middle: any = {
    row: [],
    widthSum: 0
  };
  for (let item of list) {
    Object.assign(item, getResizeWH(item, 'w', Math.min(maxWidth, item.width)));
    middle.row.push(item);
    // 按照首个元素的高度计算其他元素宽度
    const _rH = middle.row[0].height;
    Object.assign(item, getResizeWH(item, 'h', _rH));
    // 记录当前行总宽度
    middle.widthSum += item.width;
    // 记录当前行的间隔总宽度
    const rowGaps = (middle.row.length - 1) * gap;
    if (middle.widthSum + rowGaps >= boxWidth) {
      // 重新计算middle.row内的宽高
      middle.row.forEach((item: any) => {
        const _h = (item.width / middle.widthSum) * (boxWidth - rowGaps);
        Object.assign(item, getResizeWH(item, 'w', _h));
        res.push(item);
      });
      middle.row = [];
      middle.widthSum = 0;
    }
  }
  if (middle.row.length > 0) {
    res.push(...middle.row);
  }
  rowFixedHeightConfig.list = JSON.parse(JSON.stringify(res));
};

const getResizeWH = ({ width, height }:Record<'width'|'height', number>, type: 'w' | 'h', val: number) => {
  if (type === 'w') {
    return {
      width: val,
      height: height * (val / width)
    };
  }
  return {
    height: val,
    width: width * (val / height)
  };
};
</script>

<style lang="scss" scoped>
$gap: var(--FWGap);
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
  .rowFixedHeight {
    display: flex;
    grid-gap: $gap;
    flex-wrap: wrap;
  }
  .hidden {
    visibility: hidden;
  }
}
</style>
