<script setup lang='ts'>
import { react } from '@babel/types'
import { ElMessage } from 'element-plus'
import { emit } from 'process'
import { reactive, ref, toRaw } from 'vue'
import RedisServer from '../../../redis/RedisServer'
import { RedisData } from '../../../types/global'
import CommonUtils from '../../../utils/utils'

type props = {    // 设置类型
  redisList: RedisData[],
}

const props = defineProps<props>()
const emits = defineEmits(['resetConnect'])

const activeNames = ref(0)
let curData = ref<any>({})
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#c7158577',
])
const connectVisible = ref(false)
const keyList = ref<any>([])

const editConnect = (data: RedisData) => {
  connectVisible.value = true
  curData.value = data
}
const saveConnect = (data: RedisData) => {
  closeDialog()
  RedisServer.setConnectMaps(curData.value.key, { ...toRaw(curData.value), ...data })
  RedisServer.createConnect(curData.value.key, data)
  emits('resetConnect')
  curData.value = {}
}
const closeDialog = () => {
  connectVisible.value = false
}
const handleClose = () => {
  closeDialog()
}
const saveSignColor = (color: any, data: RedisData) => {
  RedisServer.setConnectMaps(data.key, color, 'color')
}
const creatRandomNumber = () => {
  ElMessage.success('当前随机数是：' + CommonUtils.randomString(-5))
}

const deleteConnect = (data: any) => {
  RedisServer.deleteConnect(data.key)
  emits('resetConnect')
}
const rediHome = (key: any) => {
  console.log('RedisServer.getRedisInfo(key) :>> ', RedisServer.getRedisInfo(key));
}

const refreshRedis = (key: string) => {
  const list: any[] = []
  const client = RedisServer.getClient(key)
  console.log('client :>> ', client);
  const stream = client.scanStream({ match: '*', count: 10 })
  console.log('stream :>> ', stream);
  stream.on('data', keys => {
    console.log('keys :>> ', keys);
    list.push(...keys)
    if (list.length > 4) {
      stream.pause();
      console.log('list :>> ', list);
    }
  });
  keyList.value = list
}
</script>

<template>
  <div>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item class="collapse-item" :style="{ '--connectcolor': data.color }" :name="index + 1"
        v-for="(data, index) of redisList">
        <template #title>
          <div class="title-template">
            <span class="title-text">{{ data.name }}</span>
            <el-space style="font-size: 16px;">
              <div title="Redis信息" class="rv-flex">
                <HomeFilled class="el-icon" @click.stop="rediHome(data.key)" />
              </div>
              <div title="Redis控制台" class="rv-flex">
                <Position class="el-icon" @click.stop="creatRandomNumber" />
              </div>
              <div title="刷新" class="rv-flex">
                <Refresh class="el-icon" @click.stop="refreshRedis(data.key)" />
              </div>
              <div class="rv-flex">
                <el-dropdown>
                  <Menu class="el-icon" @click.stop="" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <SwitchButton class="dropdown-icon" />关闭连接
                      </el-dropdown-item>
                      <el-dropdown-item @click="editConnect(data)">
                        <Edit class="dropdown-icon" />编辑连接
                      </el-dropdown-item>
                      <el-dropdown-item @click="deleteConnect(data)">
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
              <div title="标记颜色" @click.stop="">
                <el-color-picker v-model="data.color" size="small" @change="saveSignColor($event, data)"
                  :predefine="predefineColors" />
              </div>
            </el-space>
          </div>
        </template>
        <div class="tree-list">
          <tree-list :data="data" :isOpen="Number(activeNames) === index + 1"></tree-list>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <ConnectDialog v-if="connectVisible" :connectVisible="connectVisible" :connectData="curData" title="新建连接"
    @cancel-connect="closeDialog" @handle-close="handleClose" @save-connect="saveConnect">
  </ConnectDialog>
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
    background-color: var(--connectcolor);
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

  .title-text {
    color: var(--connectcolor);
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