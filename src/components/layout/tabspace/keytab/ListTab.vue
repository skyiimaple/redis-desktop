<script setup lang='ts'>
import CommonUtils from '@/utils/utils';
import { ElMessage } from 'element-plus';
import { computed, onBeforeMount, ref } from 'vue';
import RedisServer from '../../../../redis/RedisServer';
import KeyTabHeader from './component/KeyTabHeader.vue';

interface List {
  key: string
  value: string
  uniq: string
}
const props = defineProps<{ data: any }>()
const tableData = ref<List[]>([])
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('添加（List）')
const listValue = ref<string>('')

const search = ref('')
const filterTableData = computed(() => {
  return tableData.value.filter(
    (data) =>
      !search.value ||
      data.value.toString().toLowerCase().includes(search.value.toLowerCase())
  )
})

const initData = () => {
  client.lrange(key, 0, 200,).then(res => {
    tableData.value = res.map(value => {
      return { key: value, value, uniq: CommonUtils.randomString() }
    })
  })
}
const createRow = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  listValue.value = ''
}

//弹窗中的保存
const saveRowData = () => {
  if (!listValue.value) {
    ElMessage.error('请填写Value')
    return
  }
  client.rpush(key, listValue.value).then(res => {
    if (res) {
      initData()
      closeDialog()
    }
  })
}

// 删除值
const handleDelete = (row: List) => {
  CommonUtils.message('是否删除当前行数据?', 'error').then(() => {
    client.lrem(key, 1, row.key).then(res => {
      if (res === 1) {
        ElMessage.success('删除成功')
        initData()
      }
    })
  }).catch(e => { })
}
onBeforeMount(() => {
  initData()
})
</script>

<template>
  <KeyTabHeader :myKey="key" type="list" :client="client" :hostData="hostData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary" @click="createRow">添加新行</el-button>
  </div>
  <div>
    <el-table :data="filterTableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + filterTableData.length + ')'" width="150">
      </el-table-column>
      <!-- <el-table-column label="Key" prop="key" sortable /> -->
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
              <span>Size:{{ CommonUtils.getStringSize(listValue) }}</span>
            </el-tag>
          </el-space>
        </template>
        <el-input v-model="listValue" type="textarea" :autosize="{ minRows: 11, maxRows: 11 }" />
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