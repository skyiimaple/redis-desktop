<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, Ref, ref, watch, watchEffect } from 'vue';
import RedisServer from '../redis/RedisServer';
import { RedisData } from '../types/global';


interface Tree {
  label: string
  children?: Tree[]
}
type props = {
  data: RedisData,
  isOpen: boolean
}
const props = defineProps<props>()

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data = reactive<Tree[]>([])

onBeforeMount(() => {
  console.log('object :>> ', props);
})
const handleKeys = (keys: string[]) => {
  keys.forEach((key: string) => {
    data.push(getTreeList(key))
  });
}
const getTreeList = (key: string) => {
  const separator = props.data.separator || ':'
  const list: Tree = { label: '', children: [] }
  const index = key.indexOf(separator)
  if (index > -1) {
    list.label = key.split(':')[0]
    list.children?.push(getTreeList(key.substring(index + 1)))
  } else {
    list.label = key
  }
  return list
}
const queryKeys = () => {
  const client = RedisServer.getClient(props.data.key)
  const stream = client.scanStream({ match: '*', count: 5000 })
  stream.on('data', keys => {
    handleKeys(keys)
    if (data.length > 5000) {
      stream.pause();
    }
  });
}

const defaultProps = {
  children: 'children',
  label: 'label',
}
watch(() => props.isOpen, (value) => {
  if (value && !data.length) {
    queryKeys()
  }

})
</script>
