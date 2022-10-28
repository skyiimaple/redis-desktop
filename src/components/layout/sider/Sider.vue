<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import RedisServer from '../../../redis/RedisServer'
import { RedisData } from '../../../types/global'
import SiderHeader from './SiderHeader.vue'
import SiderContent from './SiderContent.vue'

// console.log(window);
const redisList = ref<RedisData[]>([])

const reset = () => {
  redisList.value = []
  RedisServer.initConnectMaps()
  for (const key in RedisServer.connectMaps) {
    if (Object.prototype.hasOwnProperty.call(RedisServer.connectMaps, key)) {
      redisList.value.push(RedisServer.connectMaps[key])
    }
  }
}

onBeforeMount(() => {
  reset()
})
</script>

<template>
  <SiderHeader :redisList="redisList"></SiderHeader>
  <el-divider style="margin: 7px 0 0" />
  <SiderContent :redisList="redisList" @resetConnect="reset"></SiderContent>
</template>

<style lang="scss" scoped></style>
