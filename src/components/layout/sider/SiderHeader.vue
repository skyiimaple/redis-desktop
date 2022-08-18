<script setup lang='ts'>
import { ref } from 'vue'
import RedisServer from '../../../redis/RedisServer'
import { RedisData } from '../../../types/global'
import ConnectDialog from './ConnectDialog.vue';

type props = {
  redisList: RedisData[],
}

const props = defineProps<props>()
const connectVisible = ref(false)
</script>

<template>
  <div class="rv-flex-between">
    <div class="sider-btn">
      <el-button type="primary" class="rv-full-width" @click="connectVisible = true">新建连接</el-button>
    </div>
    <!-- <el-button @click="creatRandomNumber">创建随机数</el-button> -->
    <div>
      <el-button icon="Setting" circle />
      <el-button type="info" icon="List" circle />
    </div>
  </div>
  <ConnectDialog :connectVisible="connectVisible" title="新建连接" @cancel-connect="connectVisible = false"
    @handle-close="connectVisible = false">
  </ConnectDialog>
</template>

<style lang='scss' scoped>
.sider-btn {
  flex: 1;
  padding-right: 10px;
}
</style>