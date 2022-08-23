<template>
  <el-tabs v-model="editableTabsValue" type="card" class="tab-box" closable @tab-remove="removeTab">
    <el-tab-pane v-for="item in editableTabs" :key="item.key" :label="item.title" :name="item.key">
      <home-tab :infoData="item.content"></home-tab>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { TabPanelName } from 'element-plus';
import { ref } from 'vue'
import { RedisData } from '../../../types/global';
import mitter from '../../../utils/bus';
import HomeTab from './hometab/HomeTab.vue';

type Tabs = {
  title: string,
  name: string,
  content?: any,
  key?: string,
  type?: 'home' | 'string' | 'set' | 'hash' | 'list' | 'sortedSet' | 'control'
}
type TabParams = {
  data: RedisData,
  info: Map<string, object>
}
const editableTabsValue = ref('1')
const editableTabs = ref<Tabs[]>([])
mitter.on('createHomeTab', (res: any) => {
  addHomeTab(res)
})


const addHomeTab = (tab: TabParams) => {
  const { name, key } = tab.data
  const tabItem = editableTabs.value.find(res => res.key === key)
  if (!tabItem) {
    editableTabs.value.push({
      title: name,
      name: name,
      key: key,
      content: tab.info,
      type: 'home'
    })
  }
  editableTabsValue.value = key
}
const removeTab = (targetName: TabPanelName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.key === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.key || ''
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.key !== targetName)
  console.log('editableTabs.value :>> ', editableTabs.value);
}
</script>
<style>
.tab-box>.el-tabs__content {
  /* padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600; */
}
</style>
