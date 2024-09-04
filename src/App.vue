<script setup lang="ts">
import {reactive, ref} from 'vue';
import WaterfallFlow from './components/waterfallFlow/index.vue'
const list = [
  {
    name: '1',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 271,
    width: 200
  },
  {
    name: '2',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 137,
    width: 140
  },
  {
    name: '3',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 154,
    width: 210
  },
  {
    name: '4',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 137,
    width: 102
  },
  {
    name: '5',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 137,
    width: 50
  },
  {
    name: '6',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 137,
    width: 310
  },
  {
    name: '7',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 138,
    width: 224
  },
  {
    name: '8',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 137,
    width: 148
  },
  {
    name: '9',
    src: 'https://oss-console-img-demo-cn-hangzhou.oss-cn-hangzhou.aliyuncs.com/example.jpg',
    height: 154,
    width: 169
  }
];

const config = reactive({
  height: 100,
  width: 200
});

const types = ref([
  {
    type: 'auto',
    name: '自动'
  },
  {
    type: 'fixedWidth',
    name: '固定宽度'
  },
  {
    type: 'fixedHeight',
    name: '固定高度'
  }
]);
const type = ref('auto');
</script>

<template>
  <div>
    <h1>瀑布流</h1>
    <el-radio-group v-model="type">
      <el-radio :value="item.type" v-for="(item) in types" :key="item.type">{{ item.name }}</el-radio>
    </el-radio-group>
  </div>
  <div>
    <WaterfallFlow :list="list" :width="config.width" :height="config.height" :type="type">
      <template #default="{ item }">
        <div class="testItem">
          {{ item.name }}
          <!-- <img :src="item.src" /> -->
        </div>
      </template>
    </WaterfallFlow>
  </div>
</template>

<style lang="scss" scoped>
.testItem {
  border: 1px solid #ccc;
  width: 100%;
  height: 100%;
  // img {
  //   width: 100%;
  //   height: 100%;
  // }
}
</style>
