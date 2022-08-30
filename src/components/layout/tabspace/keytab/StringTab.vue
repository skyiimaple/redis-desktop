<script setup lang='ts'>
import RedisServer from '@/redis/RedisServer';
import { KeyData } from '@/types/global';
import { ref } from 'vue';
import KeyTabHeader from './KeyTabHeader.vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import CommonUtils from '@/utils/utils';

const props = defineProps<{ data: KeyData }>()
const stringValue = ref('')
const selected = ref('text')

const options = [
  { value: 'text', label: 'Text', },
  { value: 'json', label: 'Json', },
]

const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
key && client.get(key).then(res => {
  stringValue.value = res || ''
})
</script>

<template>
  <KeyTabHeader :myKey="key" ttl="-1" type="string"></KeyTabHeader>
  <div class="rv-padding-row">
    <div class="rv-padding-row">
      <el-space>
        <el-select v-model="selected" class="m-2" placeholder="Select" size="small">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-tag size="small">
          <span>Size:{{  CommonUtils.getStringSize(stringValue)  }}</span>
        </el-tag>
        <el-button type="primary" text size="small" :icon="DocumentCopy">复制</el-button>
      </el-space>
    </div>
    <el-input v-model="stringValue" type="textarea" :autosize="{ minRows: 16, maxRows: 20 }" />
  </div>
  <el-button type="primary">保存</el-button>
</template>

<style lang='scss' scoped>
</style>