<script setup lang='ts'>
import RedisServer from '../../../../redis/RedisServer';

const props = defineProps<{ data: any }>()
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
console.log('key :>> ', key);
</script>

<template>
  {{ key }}
  <h2>Welcome to StringTab page! </h2>
</template>

<style lang='scss' scoped>
</style>