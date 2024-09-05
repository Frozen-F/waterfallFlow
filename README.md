# 瀑布流布局

## 1、横向瀑布流布局（固定高度）
```
    <div class="box">
        <div class="item">1</div>
        <div class="item">2</div>
    </div>
    .box {
        display: flex;
        flex-wrap: wrap;
        &::after {
            content: '';
            flex-grow: 999999999;
        }
        .item {
            flex-grow: 1;
        }
    }
```

## 2、纵向瀑布流布局（固定高度）
    分成n个泳道
```
    <div class="box">
      <div v-for="(lane, laneI) in lanes" :key="laneI">
        <div v-for="(item, index) in lane" :key="index" >
          {{ item }}
        </div>
      </div>
    </div>
    
    1、计算泳道数量
    2、存储每条甬道的当前高度
    3、循环数据，找出当前数据所属的泳道，追加到对应泳道的列表中，并把当前高度添加到对应甬道记录的高度上
    4、渲染页面

    .box {
        display: flex;
        flex-wrap: wrap;
    }
```
## 3、混合瀑布流布局
    纵向瀑布流布局和网格布局相结合
```
    1、预制多个网格布局模版，把类名作为一个集合
    2、把数据分成n个模块
    3、每个模块随机从模版集合中抽取模版名称
    4、模块使用纵向瀑布流去排列
    5、渲染页面
```
