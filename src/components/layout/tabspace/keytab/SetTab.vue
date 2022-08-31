<script setup lang='ts'>
import CommonUtils from '@/utils/utils';
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue';
import RedisServer from '../../../../redis/RedisServer';
import KeyTabHeader from './component/KeyTabHeader.vue';

interface Set {
  key: string
  value: string
  uniq: string
}

const PageSize = 200
const props = defineProps<{ data: any }>()
const tableData = ref<Set[]>([])
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('Set')
const setValue = ref<string>('')
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
const search = ref('')

const initData = () => {
  const setList: Set[] = []
  const scanOption = { match: '*', count: PageSize };
  const scanStream = client.sscanStream(key, scanOption)
  scanStream.on('data', (reply: string[]) => {
    setList.push(...reply.map(value => {
      return { key: value, value, uniq: CommonUtils.randomString() }
    }))
    if (tableData.value.length >= PageSize) {
      scanStream.pause();
      tableData.value = setList
    }
  })

  scanStream.on('end', () => {
    tableData.value = setList
  });

  scanStream.on('error', e => {
  });
}
const createRow = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  setValue.value = ''
}

//弹窗中的保存
const saveRowData = () => {
  if (!setValue.value) {
    ElMessage.error('请填写Value')
    return
  }
  client.sadd(key, setValue.value).then(res => {
    if (res) {
      initData()
      closeDialog()
    }
  })
}

// 删除值
const handleDelete = (row: Set) => {
  CommonUtils.message('是否删除当前行数据?', 'error').then(() => {
    client.srem(key, row.key).then(res => {
      if (res === 1) {
        ElMessage.success('删除成功')
        initData()
      }
    })
  }).catch()
}
onBeforeMount(() => {
  initData()
})
</script>

<template>
  <KeyTabHeader :myKey="key" type="set" :client="client" :hostData="hostData" @refreshing="initData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary" @click="createRow">添加新行</el-button>
  </div>
  <div>
    <el-table :data="tableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + tableData.length + ')'" width="150">
      </el-table-column>
      <el-table-column label="Value" prop="value" sortable />
      <el-table-column align="center" width="200">
        <template #header>
          <el-input v-model="search" size="small" />
        </template>
        <template #default="scope">
          <el-button size="small" text type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" destroy-on-close center>
    <el-form label-width="auto" label-position="top" class="ruleForm">
      <el-form-item>
        <template #label>
          <el-space>
            <span>Value</span>
            <el-tag size="small">
              <span>Size:{{ CommonUtils.getStringSize(setValue) }}</span>
            </el-tag>
          </el-space>
        </template>
        <el-input v-model="setValue" type="textarea" :autosize="{ minRows: 11, maxRows: 11 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveRowData">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang='scss' scoped>
</style>