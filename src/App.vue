<script setup lang="ts">
import { ref } from 'vue'
import Sider from './components/layout/sider/Sider.vue'
import TabSpace from './components/layout/tabspace/TabSpace.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const myWidth = ref('400px')
const mousedown = (data: any) => {
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}
const mouseup = () => {
  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', mouseup)
}
const mousemove = (event: any) => {
  /* 阻止浏览器默认事件，防止触发浏览器的手势功能 */
  event.preventDefault()
  const {
    x,
    view: { innerWidth },
  } = event
  // 最小400  最大不能超过可视界面的一半
  if (x >= 400 && x <= innerWidth / 2) {
    myWidth.value = x + 'px'
  }
}
</script>

<template>
  <el-container class="common-layout">
    <el-aside :width="myWidth">
      <Sider></Sider>
    </el-aside>
    <div class="move-box" @mousedown="mousedown">
      <div class="move-line"></div>
    </div>
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

  .el-aside,
  .el-main {
    padding: 16px 10px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.move-box {
  height: 100%;
  padding: 10px 1px;
  cursor: col-resize;

  .move-line {
    font-size: 16px;
    width: 4px;
    height: 100%;
    border-radius: 5px;
    color: #fff;
    background-color: #ccc;
    display: flex;
    align-items: center;
    user-select: none;
  }
}
</style>
