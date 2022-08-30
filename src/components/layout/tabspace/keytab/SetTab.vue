<script setup lang='ts'>
import CommonUtils from '@/utils/utils';
import { onBeforeMount, ref } from 'vue';
import RedisServer from '../../../../redis/RedisServer';

interface Set {
  key: string
  value: string
  uniq: string
}

const PageSize = 200
const props = defineProps<{ data: any }>()
const tableData = ref<Set[]>([])
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
console.log('key :>> ', key);
const search = ref('')
const handleEdit = (index: number, row: Set) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: Set) => {
  console.log(index, row)
}
const initData = () => {

  const setList: Set[] = []
  const scanOption = { match: '*', count: PageSize };
  const scanStream = client.sscanStream(key, scanOption)
  scanStream.on('data', reply => {
    console.log('reply :>> ', reply);

    setList.push(...getsetData(reply))
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

const getsetData = (list: any) => {
  const data: Set[] = [];
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

onBeforeMount(() => {
  initData()
})
</script>

<template>
  <KeyTabHeader :myKey="key" type="set" :client="client" :hostData="hostData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary">添加新行</el-button>
  </div>
  <div>
    <el-table :data="tableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + tableData.length + ')'" width="150">
      </el-table-column>
      <!-- <el-table-column label="Key" prop="key" sortable /> -->
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
</template>

<style lang='scss' scoped>
</style>