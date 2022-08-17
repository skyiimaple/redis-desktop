<script setup lang='ts'>
import { ElMessage } from "element-plus";
import Redis from "ioredis";
import { onBeforeMount, reactive, ref, toRaw } from "vue";
import RedisServer from "../../redis/RedisServer";
import CommonUtils from "../../utils/utils";
import TreeList from "../TreeList.vue";

const activeNames = ref('1');
const signColor = '#409eff'
// console.log(window);
const redisMpas: any = reactive([]);
const createConnect = () => {
  const params = {
    host: '81.71.45.213',
    port: 6379,
    name: 'mblog',
    password: '1821maple@'
  }
  redisMpas.push(RedisServer.createRedis(params));
  // const redis = new Redis(params);
  // const redisData = {
  //   auth: "1821maple@",
  //   cluster: false,
  //   color: "#85CE61",
  //   connectionName: "blog ",
  //   connectionReadOnly: false,
  //   host: "81.71.45.213",
  //   key: "1659929184658_ni39b",
  //   name: "blog ",
  //   order: "1",
  //   port: 6379,
  //   separator: ":",
  //   username: "",
  // }
  // redisMpas[params.name] = redis;
  // localStorage.setItem('connections', JSON.stringify(toRaw(redisMpas)));
  // console.log('redis :>> ', redis.options);
  // redis.keys('*key*').then(key => {
  //   console.log('redis.keys :>> ', key);
  // })
}

const creatRandomNumber = () => {
  console.log('CommonUtils :>> ', CommonUtils.randomString(-5));
  ElMessage.success('当前随机数是：' + CommonUtils.randomString(-5))
}

onBeforeMount(() => {
  RedisServer.initConnectMaps();
  for (const key in RedisServer.connectMaps) {
    if (Object.prototype.hasOwnProperty.call(RedisServer.connectMaps, key)) {
      redisMpas.push(RedisServer.connectMaps[key]);
    }
  }
})
</script>

<template>
  <div>
    <el-button type="primary" @click="createConnect">新建连接</el-button>
    <el-button @click="creatRandomNumber">创建随机数</el-button>
  </div>
  <el-divider style="margin: 10px 0 0;" />
  <div>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item class="collapse-item" :name="index" v-for="(data, index) of redisMpas">
        <template #title>
          <div class="title-template">
            <span class="title-text">{{ data.name }}</span>
            <el-space style="font-size: 16px;">
              <div title="Redis信息" class="rv-flex">
                <HomeFilled class="el-icon" @click.stop="creatRandomNumber" />
              </div>
              <div title="Redis控制台" class="rv-flex">
                <Position class="el-icon" @click.stop="creatRandomNumber" />
              </div>
              <div title="刷新" class="rv-flex">
                <Refresh class="el-icon" @click.stop="creatRandomNumber" />
              </div>
              <div class="rv-flex">
                <el-dropdown>
                  <Menu class="el-icon" @click.stop="" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <Brush class="dropdown-icon" />标记颜色
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <SwitchButton class="dropdown-icon" />关闭连接
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <Edit class="dropdown-icon" />编辑连接
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <Delete class="dropdown-icon" />删除连接
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <Cpu class="dropdown-icon" />内存分析
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <WarnTriangleFilled color="#f56c6c" class="dropdown-icon" />删除所有键
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </el-space>
          </div>
        </template>
        <div class="tree-list">
          <tree-list></tree-list>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang='scss' scoped>
.collapse-item {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: -webkit-fill-available;
    width: 5px;
    background-color: v-bind(signColor);
    margin: 5px 0;
    border-radius: 5px 0 0 5px;
    transition: all;
  }

  .tree-list {
    padding-left: 5px;
  }
}

.title-template {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-left: 10px;

  .title-sign {
    width: 10px;
    background-color: v-bind(signColor);
  }

  .title-text {
    color: v-bind(signColor);
    font-weight: bold;
  }

}

.el-icon {
  box-sizing: content-box;
  padding: 4px;
  color: #606266;

  &:hover {
    background-color: rgba($color: #ccc, $alpha: 1);
  }
}

.dropdown-icon {
  box-sizing: content-box;
  width: 16px;
  height: 16px;
  padding-right: 4px;
}
</style>