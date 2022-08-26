<script setup lang='ts'>
import RedisServer from '@/redis/RedisServer';
import { KeyData } from '@/types/global';
import { ref } from 'vue';
import KeyTabHeader from './KeyTabHeader.vue';



const props = defineProps<{ data: KeyData }>()
console.log('props :>> ', props);
const hostData = props.data.data
const key = props.data.key
const client = RedisServer.getClient(hostData.key)
console.log('key :>> ', key)
</script>

<template>
  <KeyTabHeader :myKey="key" ttl="-1" type="string"></KeyTabHeader>
  {{ key }}
  <h2>Welcome to StringTab page! </h2>
</template>

<style lang='scss' scoped>
</style>