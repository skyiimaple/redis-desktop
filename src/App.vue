<script setup lang="ts">
import Sider from './components/layout/sider/Sider.vue';
import TabSpace from './components/layout/tabspace/TabSpace.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <el-container class="common-layout">
    <el-aside width="400px">
      <Sider></Sider>
    </el-aside>
    <el-main>
      <TabSpace></TabSpace>
    </el-main>
  </el-container>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  height: 100%;
  width: 100%;
  /* color: #2c3e50; */
  /* text-align: center; */
  /* margin-top: 60px; */
}

.common-layout {

  height: 100%;
  width: 100%;

  .el-aside {
    border-right: 1px solid #ccc;
    padding: 16px 10px;
  }
}
</style>
