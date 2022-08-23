<script setup lang='ts'>
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon">
              <Coin />
            </el-icon>
            <span>服务器</span>
          </div>
        </template>
        Always
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon">
              <Cpu />
            </el-icon>
            <span>内存</span>
          </div>
        </template>
        Always
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon">
              <Odometer />
            </el-icon>
            <span>状态</span>
          </div>
        </template>
        Always
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang='scss' scoped>
.card-header {
  display: flex;
  align-items: center;

  .header-icon {
    width: 1.5em;
    font-size: 20px;
  }
}
</style>