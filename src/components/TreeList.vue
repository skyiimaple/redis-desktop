<script lang="ts" setup>
import { ElTree } from 'element-plus';
import { onBeforeMount, reactive, Ref, ref, toRaw, watch, watchEffect } from 'vue';
import RedisServer from '../redis/RedisServer';
import { RedisData } from '../types/global';
import mitter from '../utils/bus';
import CommonUtils from '../utils/utils';
import AddKeyDialog from './AddKeyDialog.vue';


interface Tree {
  label: string
  children?: Tree[]
  value?: string,
  pid?: string,
  id?: string,
  keyCount: number
}
type props = {
  data: RedisData,
  isOpen: boolean
}
const props = defineProps<props>()
const defaultProps = {
  children: 'children',
  label: 'label',
  value: 'value',
  keyCount: 'keyCount'
}
const searchMatch = ref<string>()
const treeData = ref<Tree[]>([])
const expandKey = ref<string[]>([])
const dialogVisable = ref<boolean>(false)

const handleNodeClick = (key: Tree) => {
  if (key.value) {
    mitter.emit('creatKeysTab', { data: props.data, key: key.value })
  }
}
const addKey = () => {
  dialogVisable.value = true
}

const openExpand = (data: any) => {
  expandKey.value.push(data.id)
}
const closeExpand = (data: any) => {
  expandKey.value = expandKey.value.filter(res => !res.startsWith(data.id))
}

const handleKeys = (keys: string[]) => {
  treeData.value = getTreeList(keys)
}

const getTreeList = (keys: string[]) => {
  if (!keys.length) return []
  const list = new Set()
  const arr: any = []
  keys.forEach(key => {
    const separator = props.data.separator || ':'
    const index = key.indexOf(separator)
    if (index > -1) {
      const splitList = key.split(':')
      const lastIndex = splitList.length - 1
      let pid = ''
      splitList.forEach((res, i) => {
        const item = { label: res, value: '', pid, id: '' }
        pid += res
        if (i === lastIndex) {
          item.label = res
          item.value = key
        }
        item.id = pid
        list.add(JSON.stringify(item))
      })
    } else {
      arr.push({ label: key, value: key, pid: '' })
    }
  })
  return CommonUtils.formatTree(Array.from(list).map((res: any) => {
    const item = JSON.parse(res)
    return item
  }), 'id').concat(arr)
}

const queryKeys = () => {
  let data: string[] = []
  const client = RedisServer.getClient(props.data.key)
  const COUNT = 5000
  const match = searchMatch.value ? `*${searchMatch.value}*` : '*'
  const stream = client.scanStream({ match, count: COUNT })
  stream.on('data', keys => {
    data = data.concat(keys)
    if (data.length >= COUNT) {
      stream.pause();
      handleKeys(data)
    }
  });
  stream.on('end', () => {
    handleKeys(data)
  });
}

const closeDialog = () => {
  dialogVisable.value = false
}
const updateChange = () => {
  closeDialog()
  queryKeys()
}

watch(() => props.isOpen, (value) => {
  if (value && !treeData.value.length) {
    queryKeys()
  }
})
mitter.on('refreshClient', () => {
  queryKeys()
})
mitter.on('renameKey', (data: any) => {
  queryKeys()
})
</script>

<template>
  <div class="add-btn rv-flex-between">
    <el-button type="primary" class="rv-full-width" @click="addKey">新增Key</el-button>
  </div>
  <div class="filter-bar rv-flex-between">
    <el-input class="filter-input" v-model="searchMatch" @keyup.enter.native="queryKeys">
    </el-input>
    <el-button type="primary" @click="queryKeys">查询</el-button>
  </div>
  <div class="tree-container">
    <el-tree :data="treeData" :highlight-current="true" node-key="id" :default-expanded-keys="expandKey"
      :props="defaultProps" @node-click="handleNodeClick" v-slot="{ node }" @node-expand="openExpand"
      @node-collapse="closeExpand">
      <div class="rv-flex-between custom-tree-node">
        <el-space>
          <div v-if="node.childNodes.length" class="tree-file-icon">
            <el-icon v-if="!node.expanded">
              <Folder />
            </el-icon>
            <el-icon v-else>
              <FolderOpened />
            </el-icon>
          </div>
          <el-icon v-else>
            <Key />
          </el-icon>
          <span>{{ node.label }}</span>
        </el-space>
        <span v-if="node.data.keyCount" class="tree-key-count">（{{ node.data.keyCount }}）</span>
      </div>
    </el-tree>
  </div>
  <AddKeyDialog v-if="dialogVisable" :visible="dialogVisable" :redisKey="data?.key" @updateChange="updateChange"
    @close-dialog="closeDialog">
  </AddKeyDialog>
</template>

<style lang="scss" scoped>
.add-btn {
  margin: 0 8px;
  padding: 8px 0 0;
  border-top: 1px dashed #ccc;
}

.filter-bar {

  margin: 8px;

  .filter-input {
    width: 80%
  }
}

.tree-container {
  max-height: 600px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.custom-tree-node {
  font-size: 14px;
  flex: 1;

  .tree-file-icon {
    margin-top: 5px;
    font-size: 15px;
  }

  .tree-key-count {
    font-size: 15px;
    color: #aaa;
  }
}
</style>
