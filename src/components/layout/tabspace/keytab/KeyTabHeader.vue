<script setup lang='ts'>
import { Delete, DocumentCopy, Refresh } from '@element-plus/icons-vue';



const props = defineProps<{ myKey: string | any, ttl: string, type: string, }>()
const emit = defineEmits(['copying', 'refreshing', 'deleting'])
const deleting = () => {
  emit('deleting')
}
const copying = () => {
  emit('copying')
}
const refreshing = () => {
  emit('refreshing')
}
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="10">
      <el-input v-model="myKey">
        <template #prepend>
          <span class="key-type">{{ type }}</span>
        </template>
        <template #append>
          <el-icon><Select /></el-icon>
        </template>
      </el-input>
    </el-col>
    <el-col :span="7">
      <el-input v-model="ttl">
        <template #prepend>
          <span>TTL</span>
        </template>
        <template #append>
          <el-icon><Select /></el-icon>
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