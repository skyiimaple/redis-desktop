<script setup lang='ts'>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { computed } from 'vue';
type props = {
  db: object | any
}
const props = defineProps<props>()
const data = props.db
const tableData = computed(() => {
  const dbs: DB[] = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key.startsWith('db')) {
        const [keys, expires, avg_ttl] = data[key].split(',')
        dbs.push({
          db: key,
          keys: keys.split('=')[1],
          expires: expires.split('=')[1],
          avg_ttl: avg_ttl.split('=')[1],
        });
      }
    }
  }
  return dbs
})

interface DB {
  db: string
  keys: string
  avg_ttl: string
  expires: string
}

</script>

<template>
  <el-card shadow="always">
    <template #header>
      <div class="title-icon-label">
        <el-icon>
          <Histogram />
        </el-icon>
        <span>键值统计</span>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="db" label="db" sortable />
      <el-table-column prop="keys" label="keys" sortable />
      <el-table-column prop="expires" label="expires" sortable />
      <el-table-column prop="avg_ttl" label="avg_ttl" sortable />
    </el-table>
  </el-card>
</template>

<style lang='scss' >
</style>