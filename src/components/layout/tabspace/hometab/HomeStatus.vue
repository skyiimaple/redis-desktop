<script setup lang="ts">
type props = {
  serverData: object | any
}
const props = defineProps<props>()
</script>

<template>
  <el-row :gutter="12">
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="title-icon-label">
            <el-icon>
              <Coin />
            </el-icon>
            <span>服务器</span>
          </div>
        </template>
        <el-tag class="status-container" type="info" size="large">
          <span>Redis版本:</span>
          <span class="status-text">{{ serverData.redis_version }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>进程ID:</span>
          <span class="status-text">{{ serverData.process_id }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>OS:</span>
          <span class="status-text" :title="serverData?.os">{{ serverData?.os }}</span>
        </el-tag>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="title-icon-label">
            <el-icon>
              <Cpu />
            </el-icon>
            <span>内存</span>
          </div>
        </template>
        <el-tag class="status-container" type="info" size="large">
          <span>占用内存:</span>
          <span class="status-text">{{ serverData?.used_memory_human }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>内存消耗峰值:</span>
          <span class="status-text">{{ serverData?.used_memory_peak_human }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>Lua 占用内存:</span>
          <span class="status-text">{{ serverData?.used_memory_lua / 1024 }}k</span>
        </el-tag>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="always">
        <template #header>
          <div class="title-icon-label">
            <el-icon>
              <Odometer />
            </el-icon>
            <span>状态</span>
          </div>
        </template>
        <el-tag class="status-container" type="info" size="large">
          <span>已连接数量:</span>
          <span class="status-text">{{ serverData?.connected_clients }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>历史连接数:</span>
          <span class="status-text">{{ serverData?.total_connections_received }}</span>
        </el-tag>
        <el-tag class="status-container" type="info" size="large">
          <span>历史命令数:</span>
          <span class="status-text">{{ serverData?.total_commands_processed }}</span>
        </el-tag>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss">
.status-container {
  margin: 8px 0;
  width: 100%;

  .el-tag__content {
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    .status-text {
      color: #43b50b;
    }
  }
}
</style>
