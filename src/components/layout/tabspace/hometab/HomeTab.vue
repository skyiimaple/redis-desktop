<script setup lang="ts">
import HomeStatus from './HomeStatus.vue'
import HomeKeys from './HomeKeys.vue'
import HomeInfo from './HomeInfo.vue'
type props = {
  infoData: any
}
const props = defineProps<props>()
</script>

<template>
  <home-status :serverData="infoData.info"></home-status>
  <el-divider></el-divider>
  <home-keys :db="infoData.db"></home-keys>
  <el-divider></el-divider>
  <home-info :infoData="infoData.info"></home-info>
</template>

<style lang="scss" scoped></style>
