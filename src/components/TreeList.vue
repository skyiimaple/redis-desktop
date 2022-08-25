<template>
  <div class="filter-bar rv-flex-between">
    <el-input class="filter-input" v-model="searchMatch" @keyup.enter.native="queryKeys">
    </el-input>
    <el-button type="primary" @click="queryKeys">查询</el-button>
  </div>
  <div class="tree-container">
    <el-tree :data="treeData" :highlight-current="true" :props="defaultProps" @node-click="handleNodeClick"
      v-slot="{ node }">
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
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, Ref, ref, watch, watchEffect } from 'vue';
import RedisServer from '../redis/RedisServer';
import { RedisData } from '../types/global';
import mitter from '../utils/bus';
import CommonUtils from '../utils/utils';


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

const handleNodeClick = (key: Tree) => {
  if (key.value) {
    mitter.emit('creatKeysTab', { data: props.data, key: key.value })
  }
}

const handleKeys = (keys: string[]) => {
  // const testData = ['ftsp:ratelimit:list:SB_DEP_TASK:a00fd7118e954c854b9aecd3a2a7ab6f', 'ftsp:ratelimit:list:SB_DEP_TASK:28b2bcc3c9e0608eaba3fc7525741438', 'ftsp:ratelimit:list:SB_DEP_TASK:2cb3ea4ba5f0e321fc40a061fdc97b63', 'ftsp:ratelimit:list:SB_DEP_TASK:32d615e6ab370146ded7801664b70dc6', 'ftsp:ratelimit:list:SB_DEP_TASK:5eb07d939ee2cf3299819625bb887665', 'ftsp:ratelimit:list:SB_DEP_TASK:aff3cf54bdf39b6aaeca7c44b3581721', 'ftsp:ratelimit:list:SB_DEP_TASK:8d540f90e4b7083cdfff1f2580eea285', 'ftsp:ratelimit:list:SB_DEP_TASK:add3c0ca3185eab564e9e387acd5029d', 'csp:ratelimit:list:SB_DEP_TASK:fe4198c2a6b9d8f117d30b48288293ed', 'ftsp:ratelimit:list:SB_DEP_TASK:a1a1ef6a902f7da9b05b98adc8b7605e', 'ftsp:user:illegal-token:liuxiaoping153@kg.com', 'ftsp:ratelimit:list:SB_DEP_TASK:9a3161db6042babcbbae87c24199dcee', 'ftsp:ratelimit:list:SB_DEP_TASK:8d4ca6a50d1582d339300da2e6a908ed', 'ftsp:ratelimit:list:SB_DEP_TASK:a389ff9122cdc6215a223adaba1054bc', 'csp:ratelimit:list:SB_DEP_TASK:969eb0fb1b5816fe0d71a59170786ee1', 'csp:ratelimit:list:SB_DEP_TASK:f926b3be15d28aacd82907bc2930b5ec', 'csp:ratelimit:list:SB_DEP_TASK:61a9055b1aba554d1dee9b390434c3d1', 'ftsp:ratelimit:list:SB_DEP_TASK:33b3b13ed5064145745e303bb830b36a', 'csp:ratelimit:list:SB_DEP_TASK:52456d5020c51c5d5dfc57b49deac737', 'ftsp:ratelimit:list:SB_DEP_TASK:f6dac19f38bb9e439426161a535b9f5f', 'ftsp:ratelimit:list:SB_DEP_TASK:ce848c8ae8ea6aae27df60ebefe46c29', 'ftsp:ratelimit:list:SB_DEP_TASK:cbeaa579cb50acc6d2d1f700c1551827', 'csp:ratelimit:list:SB_DEP_TASK:254a58593f5ca5242333b736074f6cb2', 'ftsp:ratelimit:list:SB_DEP_TASK:7023784b46212128017f058a1afbb45a', 'csp:ratelimit:list:SB_DEP_TASK:d18be4612ec26a5f63761c30baaf7c24', 'csp:ratelimit:list:SB_DEP_TASK:c0bdedb1a889c15a7e96c1abd0cdfce1', 'ftsp:ratelimit:list:SB_DEP_TASK:94cc391e89f52c3c7784085e6959bb81', 'csp:ratelimit:list:SB_DEP_TASK:3e050ef3d19c735ebf6167d5ce6728dd', 'ftsp:ratelimit:list:SB_DEP_TASK:41298ccba437ae1cae1fba5a9a1c6b64', 'csp:ratelimit:list:SB_DEP_TASK:4db6a159276b013dd0a2e3169eca2736', 'ftsp:ratelimit:list:SB_DEP_TASK:480526d27272b3e9adba467cd0c5bc10', 'csp:ratelimit:list:SB_DEP_TASK:d15c2e51d6e8bb2c5a31eee94b1ca600', 'ftsp:ratelimit:list:SB_DEP_TASK:726823a4dff2afb09a075d83b8aada13', 'csp:ratelimit:list:SB_DEP_TASK:0aba1abe192c295e90c57eca8f8cddc4', 'ftsp:ratelimit:list:SB_DEP_TASK:75f62fbdb2b84340d193e619d3197576', 'csp:ratelimit:list:SB_DEP_TASK:2c2d8856c7b2e21ab09f4a348cee7fef', 'ftsp:ratelimit:list:SB_DEP_TASK:f21315878645fb44b3591a84da456a8b', 'csp:ratelimit:list:SB_DEP_TASK:e7f7e239ea95ce7fd78f801cce4530f9', 'ftsp:ratelimit:list:SB_DEP_TASK:633e8e039cbe183b6afc7b73163d129a', 'ftsp:ratelimit:list:SB_DEP_TASK:0c964ee80707bdc63250cc5aa2d6fd11', 'ftsp:ratelimit:list:SB_DEP_TASK:3ad4e50a6a92b467deeb46cb0582f9b2', 'ftsp:ratelimit:list:SB_DEP_TASK:a8063e5e72f98c5df9ed8dd63eab8057', 'ftsp:ratelimit:list:SB_DEP_TASK:47da91decc524c517205b35bd9cddf56', 'csp:ratelimit:list:SB_DEP_TASK:bd9471ff3135bb7b008a35dbab4eaf55', 'ftsp:ratelimit:list:SB_DEP_TASK:b17fdf1bf0b8305ab7260394e1758dc3', 'ftsp:ratelimit:list:SB_DEP_TASK:ac823af7b300e938c82e05da08b16952', 'ftsp:ratelimit:list:SB_DEP_TASK:4762ef20cd68df66a5b411217febe290', 'ftsp:ratelimit:list:SB_DEP_TASK:e2ff7677421e28fbeecb3d70ec609b53', 'csp:ratelimit:list:SB_DEP_TASK:f331087f9941170b8e47644cd115ccc1', 'ftsp:ratelimit:list:SB_DEP_TASK:e9ddc27278d2510da758374231d3b65d']
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
  console.log('match :>> ', match);
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

watch(() => props.isOpen, (value) => {
  if (value && !treeData.value.length) {
    queryKeys()
  }
})
</script>


<style lang="scss" scoped>
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
