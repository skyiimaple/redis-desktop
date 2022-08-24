<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';
// import Search from ''
type props = {
  infoData: any
}
const props = defineProps<props>()
const infoData = props.infoData
const searchValue = ref('')
const tableData = computed(() => {
  const dbs: Info[] = [];
  for (const key in infoData) {
    if (Object.prototype.hasOwnProperty.call(infoData, key)) {
      if (searchValue.value) {
        if (key.includes(searchValue.value)) {
          dbs.push({ values: infoData[key], key: key, });
        }
      } else {
        dbs.push({ values: infoData[key], key: key, });
      }
    }
  }
  return dbs
})

interface Info {
  key: string
  values: string
}

</script>

<template>
  <el-card shadow="always">
    <template #header>
      <div class="card-header rv-flex-between">
        <div>
          <el-icon class="header-icon">
            <List />
          </el-icon>
          <span>Redis全部信息</span>
        </div>
        <div>
          <el-input v-model="searchValue" :suffix-icon="Search"></el-input>
        </div>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="key" label="key" />
      <el-table-column prop="values" label="values" />
    </el-table>
  </el-card>
</template>

<style lang='scss'>
</style>