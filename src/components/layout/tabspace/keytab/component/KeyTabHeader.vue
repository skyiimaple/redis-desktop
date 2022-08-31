<script setup lang='ts'>
import RedisServer from '@/redis/RedisServer';
import { RedisData } from '@/types/global';
import mitter from '@/utils/bus';
import CommonUtils from '@/utils/utils';
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
  CommonUtils.message(`即将删除键【${props.myKey}】，是否确认？`).then(() => {
    client.del(props.myKey).then(res => {
      ElMessage.success('删除成功')
      mitter.emit('refreshClient')
      const tabKey = props.hostData.key + '_' + props.myKey
      mitter.emit('closeTab', { tabKey, type: 'one' })
    })
  })
}
const copying = () => {
  emit('copying')
}
const refreshing = () => {
  RedisServer.existsKey(client, props.myKey, () => {
    getTTL()
    emit('refreshing')
  })
}
const renameKey = (e: any) => {
  if (curKey.value === props.myKey) {
    return
  }
  CommonUtils.message(`是否修改名字${props.myKey} -> ${curKey.value}`).then(() => {
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
    CommonUtils.message(`设置TTL<=0将删除该key，是否确认？`).then(() => {
      setTTL(true)
    })
  } else {
    setTTL()
  }
}
const setTTL = (delKey: boolean = false) => {
  client.expire(props.myKey, keyTTL.value).then((res) => {
    if (res) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(`【${props.myKey}】 键不存在`)
    }
    if (delKey) {
      mitter.emit('refreshClient')
    }
  }).catch(e => {
    ElMessage.error('TTL Error: ' + e.message);
  });
}

const presetTTL = () => {
  client.persist(props.myKey).then(res => {
    if (res) {
      ElMessage.success('修改成功')
      refreshing()
      mitter.emit('refreshClient')
    }
  })
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
          <span class="key-type">{{ type }}</span>
        </template>
        <template #append>
          <el-icon @click="renameKey"><Select /></el-icon>
        </template>
        <el-icon slot="suffix"><Select /></el-icon>
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
        <template #suffix>
          <el-icon title="清除过期时间" @click="presetTTL">
            <CloseBold />
          </el-icon>
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