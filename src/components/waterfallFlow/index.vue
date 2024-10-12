<template>
  <div
    class="waterfallFlowWrapper"
    :style="{ '--itemHeight': `${props.height}px`, '--itemWidth': `${props.width}px` }"
  >
    <template v-if="props.type === 'auto'">
      <WaterfallFlowItem :list="targets" :width="props.width * 2 + 8" type="fixedWidth">
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
          width: props.width
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
import { defineComponent, onMounted, reactive, ref, PropType, computed } from 'vue';
import WaterfallFlowItem from './components/index.vue';

defineComponent({ name: 'waterfallFlowWrapper' });

interface ListItem {
  height: number; // fixedWidth
  width: number; // fixedHeight
  [key: string]: any;
}

const props = defineProps({
  type: {
    type: String as PropType<'fixedWidth' | 'fixedHeight' | 'auto'>,
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
  }
});

const config = reactive({
  classList: ['temp1_row1', 'temp1_row2', 'temp2_row1', 'temp2_row2', 'temp3_left2', 'temp3_right2']
});
const targets = ref([]);

onMounted(() => {
  getTableData();
});

const getTableData = () => {
  const { height, width, list } = props;
  const res: any = [];
  for (let i = 0; i < list.length; i++) {
    const index = Math.floor(Math.random() * 10) % (config.classList.length - 1);
    const className = config.classList[index];
    if (!className) continue;
    const [_numC, _rowC] = className.split('_');
    const num = _numC.replace('temp', '');
    res.push({
      className,
      height: _rowC.endsWith('1') ? height : height * 2 + 8,
      width: width * 2 + 8,
      list: list.slice(i, i + +num)
    });
    i += +num - 1;
  }
  targets.value = res;
};
</script>

<style lang="scss" scoped>
.waterfallFlowWrapper {
  display: flex;
  grid-gap: 8px;
  flex-wrap: wrap;
  .gridBox {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: repeat(2, var(--itemWidth));
    grid-template-rows: repeat(2, var(--itemHeight));
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
    grid-template-rows: repeat(1, var(--itemHeight));
    grid-template-areas: 'item1 item1';
  }
  .temp1_row2 {
    grid-template-areas:
      'item1 item1'
      'item1 item1';
  }
  .temp2_row1 {
    grid-template-rows: repeat(1, var(--itemHeight));
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
