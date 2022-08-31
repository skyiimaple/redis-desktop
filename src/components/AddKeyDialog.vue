<script setup lang='ts'>
import { reactive } from 'vue';

const options = [
  { value: 'string', label: 'String', },
  { value: 'hash', label: 'Hash', },
  { value: 'list', label: 'List', },
  { value: 'set', label: 'Set', },
  { value: 'zset', label: 'Zset', },
]

type props = {
  visible: boolean,
  key: string
}
const props = defineProps<props>()
const emits = defineEmits(['updateChange', 'closeDialog'])
const params = reactive({
  key: '', type: 'string', value: '', field: '',
})
const saveData = () => {
  emits('updateChange', params)
}
const handleClose = () => {
  console.log('初始化 :>> ',)
  emits('closeDialog')
}
</script>

<template>
  <el-dialog v-model="visible" title="增加Key" :before-close="handleClose" center>
    <el-form label-width="auto" label-position="top" class="ruleForm">
      <el-form-item label="key">
        <el-input v-model="params.key" />
      </el-form-item>
      <el-form-item label="Type">
        <el-select v-model="params.type" class="rv-full-width">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Field" v-if="['zset', 'hash'].includes(params.type)">
        <el-input v-model="params.field" />
      </el-form-item>
      <el-form-item label="Value">
        <el-input v-model="params.value" type="textarea" :autosize="{ minRows: 6, maxRows: 11 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang='scss' scoped>
</style>