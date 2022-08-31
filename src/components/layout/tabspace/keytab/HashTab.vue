<script setup lang='ts'>
import RedisServer from '@/redis/RedisServer';
import CommonUtils from '@/utils/utils';
import { ElMessage } from 'element-plus';
import { computed, onBeforeMount, reactive, ref } from 'vue';

interface Hash {
  key: string
  value: string
  uniq: string
}
const PageSize = 200
const props = defineProps<{ data: any }>()
const tableData = ref<Hash[]>([])
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
const search = ref<string>('')
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('添加（Hash）')
const params = reactive({ fieldName: '', value: '' })
const loading = ref<boolean>(false)

// 表格数据
const filterTableData = computed(() => {
  // return tableData.value
  return tableData.value.filter(
    (data) =>
      !search.value ||
      data.key.toLowerCase().includes(search.value.toLowerCase()) ||
      data.value.toLowerCase().includes(search.value.toLowerCase())
  )
})
const handleEdit = (index: number, row: Hash) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: Hash) => {
  console.log(index, row)
}

// 初始化当前键值的的数据
const initData = () => {
  RedisServer.existsKey(client, key, () => {
    const hashList: Hash[] = []
    const scanOption = { match: '*', count: PageSize };
    const scanStream = client.hscanStream(key, scanOption)
    scanStream.on('data', reply => {
      hashList.push(...getHashData(reply))
      if (tableData.value.length >= PageSize) {
        scanStream.pause();
        tableData.value = hashList
      }
    })

    scanStream.on('end', () => {
      tableData.value = hashList
    });

    scanStream.on('error', e => {
    });
  })
}

// 格式化获取到的Hash 数组
const getHashData = (list: any) => {
  const data: Hash[] = [];
  if (list?.length) {
    for (var i = 0; i < list.length; i += 2) {
      data.push({
        key: list[i],
        value: list[i + 1],
        uniq: CommonUtils.randomString(),
      });
    }
  }
  return data;
}

const createRow = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  loading.value = false
  params.fieldName = ''
  params.value = ''
}

//弹窗中的保存
const saveRowData = () => {
  if (params.fieldName && params.value) {
    loading.value = true
    client.hset(key, params.fieldName, params.value).then(res => {
      if (res) {
        initData()
        closeDialog()
      }
    })
  } else {
    ElMessage.error(params.fieldName ? '请填写Value' : '请填写Field')
  }
}

onBeforeMount(() => {
  initData()
})
</script>

<template>
  <KeyTabHeader :myKey="key" type="hash" :client="client" :hostData="hostData" @refreshing="initData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary" @click="createRow">添加新行</el-button>
  </div>
  <div>
    <el-table :data="filterTableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + filterTableData.length + ')'" width="150">
      </el-table-column>
      <el-table-column label="Key" prop="key" sortable />
      <el-table-column label="Value" prop="value" sortable />
      <el-table-column align="right" width="200">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" text type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" destroy-on-close center>
    <el-form label-width="auto" label-position="top" class="ruleForm">
      <el-form-item label="Field" prop="host">
        <el-input v-model="params.fieldName" />
      </el-form-item>
      <el-form-item prop="port">
        <template #label>
          <span>Value</span>
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

<style lang='scss' scoped>
</style>