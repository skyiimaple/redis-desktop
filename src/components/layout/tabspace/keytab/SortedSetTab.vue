<script setup lang="ts">
import RedisServer from '../../../../redis/RedisServer'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import CommonUtils from '@/utils/utils'
import KeyTabHeader from './component/KeyTabHeader.vue'
import { ElMessage } from 'element-plus'

interface Zset {
  score: number
  member: string
  uniq: string
}

const props = defineProps<{ data: any }>()
const tableData = ref<Zset[]>([])
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('添加（Zset）')
const params = reactive({ fieldName: '', value: '' })
const loading = ref<boolean>(false)
let editRowItem: Zset | null
const search = ref('')

const initData = () => {
  client.zrevrange(key, 0, 100, 'WITHSCORES').then((res) => {
    tableData.value = getZsetData(res)
  })
}
const filterTableData = computed(() => {
  // return tableData.value
  return tableData.value.filter(
    (data) =>
      !search.value ||
      data.score.toString().toLowerCase().includes(search.value.toLowerCase()) ||
      data.member.toLowerCase().includes(search.value.toLowerCase()),
  )
})
const getZsetData = (list: any) => {
  const data: Zset[] = []
  if (list?.length) {
    for (var i = 0; i < list.length; i += 2) {
      data.push({
        score: Number(list[i + 1]),
        member: list[i],
        uniq: CommonUtils.randomString(),
      })
    }
  }
  return data
}
const createRow = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  editRowItem = null
  dialogVisible.value = false
  loading.value = false
  params.fieldName = ''
  params.value = ''
}

//弹窗中的保存
const saveRowData = () => {
  if (!(params.fieldName && params.value)) {
    ElMessage.error(params.fieldName ? '请填写Value' : '请填写Score')
    return
  }
  loading.value = true
  client.zadd(key, params.fieldName, params.value).then((res) => {
    if (editRowItem && editRowItem.member !== params.value) {
      client.zrem(key, editRowItem.member)
    }
    initData()
    closeDialog()
    ElMessage.success(res ? '添加成功' : '修改成功')
  })
}

// 编辑行数据
const editRowData = (row: Zset) => {
  dialogTitle.value = '修改（Zset）'
  editRowItem = row
  params.fieldName = row.score.toString()
  params.value = row.member
  dialogVisible.value = true
}

// 删除值
const handleDelete = (row: Zset) => {
  CommonUtils.message('是否删除当前行数据?', 'error')
    .then(() => {
      client.zrem(key, row.member).then((res) => {
        if (res === 1) {
          ElMessage.success('删除成功')
          initData()
        }
      })
    })
    .catch((e) => {})
}

onBeforeMount(() => {
  initData()
})
</script>

<template>
  <KeyTabHeader :myKey="key" type="zset" :client="client" :hostData="hostData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary" @click="createRow">添加新行</el-button>
  </div>
  <div>
    <el-table :data="filterTableData" border>
      <el-table-column
        type="index"
        :label="'ID (Total: ' + filterTableData.length + ')'"
        width="150"
      >
      </el-table-column>
      <el-table-column label="Score" prop="score" sortable />
      <el-table-column label="Member" prop="member" sortable />
      <el-table-column align="right" width="200">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" text type="primary" @click="editRowData(scope.row)"
            >修改</el-button
          >
          <el-button size="small" text type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" destroy-on-close center>
    <el-form label-width="auto" label-position="top" class="ruleForm">
      <el-form-item label="Score">
        <el-input v-model="params.fieldName" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-space>
            <span>Value</span>
            <el-tag size="small">
              <span>Size:{{ CommonUtils.getStringSize(params.value) }}</span>
            </el-tag>
          </el-space>
        </template>
        <el-input v-model="params.value" type="textarea" :autosize="{ minRows: 11, maxRows: 11 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveRowData" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
