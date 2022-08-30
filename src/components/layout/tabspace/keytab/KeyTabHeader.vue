<script setup lang='ts'>
import { RedisData } from '@/types/global';
import mitter from '@/utils/bus';
import { Delete, DocumentCopy, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Redis from 'ioredis';
import { onBeforeMount, ref } from 'vue';



const props = defineProps<{ myKey: string | any, type: string, client: Redis, hostData: RedisData }>()
const curKey = ref(props.myKey)
const keyTTL = ref<number>(-1)
const client = props.client
const emit = defineEmits(['copying', 'refreshing', 'deleting', 'renameKey'])
const deleting = () => {
  emit('deleting')
}
const copying = () => {
  emit('copying')
}
const refreshing = () => {
  getTTL()
  emit('refreshing')
}
const renameKey = (e: any) => {
  if (curKey.value === props.myKey) {
    return
  }
  ElMessageBox.confirm(`是否修改名字${props.myKey} -> ${curKey.value}`, '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    client.rename(props.myKey, curKey.value).then(res => {
      if (res === 'OK') {
        ElMessage.success('修改成功')
        mitter.emit('renameKey', { old: props.myKey, new: curKey.value, hostData: props.hostData })
      }
    }).catch(e => {
      ElMessage.error(e.message);
    })
  })
}
const getTTL = () => {
  client.ttl(props.myKey).then((reply) => {
    keyTTL.value = reply;
  }).catch(e => {
    ElMessage.error('TTL Error: ' + e.message);
  });
}

const saveTTL = () => {
  if (keyTTL.value < 0) {
    ElMessageBox.confirm(`设置TTL<=0将删除该key，是否确认？`, '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      setTTL(true)
    })
  } else {
    setTTL()
  }
}
const setTTL = (delKey: boolean = false) => {
  console.log('123 :>> ', 123);
  client.expire(props.myKey, keyTTL.value).then((res) => {
    if (res) {
      ElMessage.success('修改成功')
    }
    if (delKey) {
      mitter.emit('refreshClient')
    }
  }).catch(e => {
    console.log('e :>> ', e);
    ElMessage.error('TTL Error: ' + e.message);
  });
}

onBeforeMount(() => {
  getTTL()
})
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="10">
      <el-input v-model="curKey" @keyup.enter.native="renameKey">
        <template #prepend>
          <span class="key-type">{{  type  }}</span>
        </template>
        <template #append>
          <el-icon @click="renameKey"><Select /></el-icon>
        </template>
      </el-input>
    </el-col>
    <el-col :span="7">
      <el-input v-model="keyTTL">
        <template #prepend>
          <span>TTL</span>
        </template>
        <template #append>
          <el-icon @click="saveTTL"><Select /></el-icon>
        </template>
      </el-input>
    </el-col>
    <el-col :span="7">
      <el-button type="danger" :icon="Delete" @click="deleting" />
      <el-button type="success" :icon="Refresh" @click="refreshing" />
      <el-button type="primary" :icon="DocumentCopy" @click="copying" />
    </el-col>
  </el-row>
</template>

<style lang='scss' scoped>
.key-type {
  text-transform: capitalize
}
</style>