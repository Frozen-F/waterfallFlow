<script setup lang="ts">
import {reactive, ref, computed} from 'vue';
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

const types = ref([
  {
    type: 'auto',
    name: '混合瀑布流布局',
    props: {
      height: 100,
      width: 200
    }
  },
  {
    type: 'fixedWidth',
    name: '纵向瀑布流布局',
    props: {
      width: 200
    }
  },
  {
    type: 'fixedHeight',
    name: '横向瀑布流布局',
    props: {
      height: 200,
    }
  },
  {
    type: 'rowFixedHeight',
    name: '横向瀑布流布局(高度不固定)',
    props: {
      maxWidth: 300,
    }
  }
]);
const type = ref<'fixedWidth' | 'fixedHeight' | 'auto' | 'rowFixedHeight'>('auto');

const sizeConfig = computed(()=>{
  const [_config] = types.value.filter((item)=>item.type === type.value);
  return _config.props
})
</script>

<template>
  <div>
    <h1>瀑布流</h1>
    <el-radio-group v-model="type">
      <el-radio :value="item.type" v-for="(item) in types" :key="item.type">{{ item.name }}</el-radio>
    </el-radio-group>
  </div>
  <div>
    <WaterfallFlow :list="list" :type="type" v-bind="sizeConfig">
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
