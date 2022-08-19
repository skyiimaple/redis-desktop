<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { ref } from 'vue'
import RedisServer from '../../../redis/RedisServer'
import { RedisData } from '../../../types/global'
import ConnectDialog from './ConnectDialog.vue';

type props = {
  redisList: RedisData[],
}

const props = defineProps<props>()
const connectVisible = ref(false)
const saveConnect = (data: any) => {
  closeDialog()
  const { data: redis } = RedisServer.createRedis(data)
  props.redisList.push(redis)
}
const closeDialog = () => {
  connectVisible.value = false
}
const handleClose = () => {
  closeDialog()
}
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
  <ConnectDialog :connectVisible="connectVisible" model="create" title="新建连接" @cancel-connect="closeDialog"
    @handle-close="handleClose" @save-connect="saveConnect">
  </ConnectDialog>
</template>

<style lang='scss' scoped>
.sider-btn {
  flex: 1;
  padding-right: 10px;
}
</style>