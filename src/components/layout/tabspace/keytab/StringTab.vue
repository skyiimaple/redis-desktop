<script setup lang='ts'>
import RedisServer from '@/redis/RedisServer';
import { KeyData } from '@/types/global';
import { onBeforeMount, ref } from 'vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import CommonUtils from '@/utils/utils';
import { ElMessage } from 'element-plus';
import KeyTabHeader from './component/KeyTabHeader.vue';

const props = defineProps<{ data: KeyData }>()
const stringValue = ref('')
const selected = ref('text')

const options = [
  { value: 'text', label: 'Text', },
  { value: 'json', label: 'Json', },
]

const hostData = props.data.data
const key = props.data.key || ''
const client = RedisServer.getClient(hostData.key)
const getString = () => {
  client.get(key).then(res => {
    if (res) {
      stringValue.value = res
    }
  }).catch(e => {
    ElMessage.error(e.message);
  })
}
const saveString = () => {
  client.set(key, stringValue.value).then(res => {
    if (res === 'OK') {
      ElMessage.success('修改成功')
    }
  }).catch(e => {
    ElMessage.error(e.message);
  })
}
onBeforeMount(() => {
  getString()
})

</script>

<template>
  <KeyTabHeader :myKey="key" type="string" :client="client" :hostData="hostData" @refreshing="getString"></KeyTabHeader>
  <div class="rv-padding-row">
    <div class="rv-padding-row">
      <el-space>
        <el-select v-model="selected" class="m-2" placeholder="Select" size="small" disabled>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-tag size="small">
          <span>Size:{{ CommonUtils.getStringSize(stringValue) }}</span>
        </el-tag>
        <el-button type="primary" text size="small" :icon="DocumentCopy">复制</el-button>
      </el-space>
    </div>
    <el-input v-model="stringValue" type="textarea" :autosize="{ minRows: 16, maxRows: 20 }" />
  </div>
  <el-button type="primary" @click="saveString()">保存</el-button>
</template>

<style lang='scss' scoped>
</style>