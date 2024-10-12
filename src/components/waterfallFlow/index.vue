<template>
  <div
    class="bitWaterfallFlowWrapper"
    :style="{
      '--FWitemHeight': `${props.height}px`,
      '--FWitemWidth': `${props.width}px`,
      '--FWGap': `${props.gap}px`
    }"
  >
    <template v-if="props.type === 'auto'">
      <WaterfallFlowItem :list="targets" :width="props.width * 2 + props.gap" type="fixedWidth">
        <template #default="{ item }">
          <div class="gridBox" :class="item.className">
            <div v-for="(_item, i) in item.list" :key="i">
              <slot :item="_item"></slot>
            </div>
          </div>
        </template>
      </WaterfallFlowItem>
    </template>
    <template v-else>
      <WaterfallFlowItem
        v-bind="{
          list: props.list,
          type: props.type,
          height: props.height,
          width: props.width,
          maxWidth: props.maxWidth,
          gap: props.gap
        }"
      >
        <template #default="{ item }">
          <slot :item="item"></slot>
        </template>
      </WaterfallFlowItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref, PropType, nextTick, watch } from 'vue';
import WaterfallFlowItem from './components/index.vue';

defineComponent({ name: 'BitWaterfallFlow' });

interface ListItem {
  height: number; // fixedWidth
  width: number; // fixedHeight
  [key: string]: any;
}

const props = defineProps({
  type: {
    type: String as PropType<'fixedWidth' | 'fixedHeight' | 'auto' | 'rowFixedHeight'>,
    required: false,
    default: 'fixedHeight'
  },
  list: {
    type: Array as PropType<ListItem[]>,
    required: false,
    default: () => []
  },
  // ['fixedHeight' | 'auto']
  height: {
    type: Number,
    required: false,
    default: 200
  },
  // ['fixedWidth' | 'auto']
  width: {
    type: Number,
    required: false,
    default: 200
  },
  // rowFixedHeight 时传
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

// auto训练模版
const config = reactive({
  classList: ['temp1_row1', 'temp1_row2', 'temp2_row1', 'temp2_row2', 'temp3_left2', 'temp3_right2']
});
const targets = ref([]);

watch(
  () => props.list,
  async() => {
    await nextTick();
    getTableData();
  },
  {
    deep: true,
    immediate: true
  }
);
watch(
  () => props.type,
  async() => {
    await nextTick();
    getTableData();
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(() => {
  getTableData();
});

const getTableData = () => {
  const { type, list, height, width } = props;
  if (type !== 'auto') return;
  const res: any = [];
  for (let i = 0; i < list.length; i++) {
    const index = Math.floor(Math.random() * 10) % (config.classList.length - 1);
    const className = config.classList[index];
    if (!className) continue;
    const [_numC, _rowC] = className.split('_');
    const num = _numC.replace('temp', '');
    res.push({
      className,
      height: _rowC.endsWith('1') ? height : height * 2 + props.gap,
      width: width * 2 + props.gap,
      list: list.slice(i, i + +num)
    });
    i += +num - 1;
  }
  targets.value = res;
};

</script>

<style lang="scss" scoped>
.bitWaterfallFlowWrapper {
  display: flex;
  grid-gap: var(--FWGap);
  flex-wrap: wrap;
  .gridBox {
    display: grid;
    grid-gap: var(--FWGap);
    grid-template-columns: repeat(2, var(--FWitemWidth));
    grid-template-rows: repeat(2, var(--FWitemHeight));
    & > div {
      &:nth-child(1) {
        grid-area: item1;
      }
      &:nth-child(2) {
        grid-area: item2;
      }
      &:nth-child(3) {
        grid-area: item3;
      }
      &:nth-child(4) {
        grid-area: item4;
      }
    }
  }
  .temp1_row1 {
    grid-template-rows: repeat(1, var(--FWitemHeight));
    grid-template-areas: 'item1 item1';
  }
  .temp1_row2 {
    grid-template-areas:
      'item1 item1'
      'item1 item1';
  }
  .temp2_row1 {
    grid-template-rows: repeat(1, var(--FWitemHeight));
    grid-template-areas: 'item1 item2';
  }
  .temp2_row2 {
    grid-template-areas:
      'item1 item2'
      'item1 item2';
  }
  .temp3_left2 {
    grid-template-areas:
      'item1 item2'
      'item3 item2';
  }
  .temp3_right2 {
    grid-template-areas:
      'item1 item2'
      'item1 item3';
  }
}
</style>
