<script setup lang='ts'>
import RedisServer from '../../../../redis/RedisServer';
import { computed, ref } from 'vue'
import CommonUtils from '@/utils/utils';

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
client.zrevrange(key, 0, 100, 'WITHSCORES').then(res => {
  tableData.value = getZsetData(res)
})
const search = ref('')
const filterTableData = computed(() => {
  // return tableData.value
  return tableData.value.filter(
    (data) =>
      !search.value ||
      data.score.toString().toLowerCase().includes(search.value.toLowerCase()) ||
      data.member.toLowerCase().includes(search.value.toLowerCase())
  )
})
const handleEdit = (index: number, row: Zset) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: Zset) => {
  console.log(index, row)
}
const getZsetData = (list: any) => {
  const data: Zset[] = [];
  if (list?.length) {
    for (var i = 0; i < list.length; i += 2) {
      data.push({
        score: Number(list[i + 1]),
        member: list[i],
        uniq: CommonUtils.randomString(),
      });
    }
  }
  return data;
}
</script>

<template>
  <KeyTabHeader :myKey="key" type="zset" :client="client" :hostData="hostData"></KeyTabHeader>
  <div class="divider-btn">
    <el-button type="primary">添加新行</el-button>
  </div>
  <div>
    <el-table :data="filterTableData" border>
      <el-table-column type="index" :label="'ID (Total: ' + filterTableData.length + ')'" width="150">
      </el-table-column>
      <el-table-column label="Score" prop="score" sortable />
      <el-table-column label="Member" prop="member" sortable />
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