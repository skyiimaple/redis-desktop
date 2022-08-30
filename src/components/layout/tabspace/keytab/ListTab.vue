<script setup lang='ts'>
import CommonUtils from '@/utils/utils';
import { computed, ref } from 'vue';
import RedisServer from '../../../../redis/RedisServer';

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
client.lrange(key, 0, 200,).then(res => {
  console.log('res :>> ', res);
  tableData.value = getListData(res)
})
const search = ref('')
const filterTableData = computed(() => {
  return tableData.value.filter(
    (data) =>
      !search.value ||
      data.value.toString().toLowerCase().includes(search.value.toLowerCase())
  )
})
const handleEdit = (index: number, row: List) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: List) => {
  console.log(index, row)
}
const getListData = (list: any) => {
  const data: List[] = [];
  if (list?.length) {
    for (var i = 0; i < list.length; i++) {
      data.push({
        key: list[i],
        value: list[i],
        uniq: CommonUtils.randomString(),
      });
    }
  }
  return data;
}
</script>

<template>
  <KeyTabHeader :myKey="key" ttl="-1" type="list"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary">添加新行</el-button>
  </div>
  <div>
    <el-table :data="filterTableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + filterTableData.length + ')'" width="150">
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