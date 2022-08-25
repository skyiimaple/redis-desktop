<template>
  <el-tabs v-model="editableTabsValue" type="card" class="tab-box" closable @tab-remove="removeTab">
    <el-tab-pane v-for="item in editableTabs" :key="item.key" :label="item.title" :name="item.name">
      <template #label>
        <span class="title-icon-label" style="font-weight: 600;">
          <el-icon>
            <Platform v-if="item.type === 'home'" />
            <Promotion v-else-if="item.type === 'control'" />
            <Key v-else />
          </el-icon>
          <span>{{ item.title }}</span>
        </span>
      </template>
      <home-tab :infoData="item.content" v-if="item.type === 'home'"></home-tab>
      <controller-tab v-else-if="item.type === 'control'"></controller-tab>
      <!-- <key-details v-else></key-details> -->
      <component :is="item.content.component" :data="item.content"></component>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { TabPanelName } from 'element-plus';
import { markRaw, ref } from 'vue'
import { RedisData } from '../../../types/global';
import mitter from '../../../utils/bus';
import HomeTab from './hometab/HomeTab.vue';
import ControllerTab from './ControllerTab.vue';
import RedisServer from '../../../redis/RedisServer';
import StringTab from "./keytab/StringTab.vue";
import SetTab from "./keytab/SetTab.vue";
import HashTab from "./keytab/HashTab.vue";
import ListTab from "./keytab/ListTab.vue";
import SortedSetTab from "./keytab/SortedSetTab.vue";

type TabType = 'home' | 'control' | 'string' | 'set' | 'hash' | 'list' | 'zset'

type Tabs = {
  title: string,
  name: string,
  content?: any,
  key?: string,
  type?: TabType
}
type TabParams = {
  data: RedisData,
  info: object,
  db?: object
}
const editableTabsValue = ref('1')
const editableTabs = ref<Tabs[]>([])
const componentMap = new Map<string, any>([
  ['string', markRaw(StringTab)],
  ['set', markRaw(SetTab)],
  ['hash', markRaw(HashTab)],
  ['list', markRaw(ListTab)],
  ['zset', markRaw(SortedSetTab)]
])
mitter.on('createHomeTab', (res: any) => {
  const { name, key } = res.data
  addTabByType(name, key, 'home', res)
})
mitter.on('creatControllerTab', (res: any) => {
  const { name, key } = res.data
  const id = key + '_Controller'
  addTabByType(name, id, 'control', res)
})
mitter.on('creatKeysTab', (res: any) => {
  const { key, data } = res
  const { name: clientName, key: clientKey } = data
  const name = key + ' | ' + clientName
  const id = clientKey + '_' + key
  const client = RedisServer.getClient(clientKey)
  client.type(key).then(type => {
    if (componentMap.has(type)) {
      addTabByType(name, id, 'string', { ...res, component: componentMap.get(type) })
    }
  })
  // const componentName =
})


const addTabByType = (name: string, key: string, type: TabType, tab: TabParams) => {
  const tabItem = editableTabs.value.find(res => res.key === key)
  if (!tabItem) {
    editableTabs.value.push({
      title: name,
      name: key,
      key, type,
      content: tab
    })
  }
  editableTabsValue.value = key
}
const removeTab = (targetName: TabPanelName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name || ''
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>
<style lang="scss">
.tab-box {
  height: 100%;


  &>.el-tabs__content {
    height: calc(100% - 55px);
    overflow: auto;
    padding: 0 6px;
  }

}
</style>
