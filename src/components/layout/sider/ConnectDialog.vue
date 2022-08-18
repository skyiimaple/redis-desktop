<script setup lang='ts'>import { reactive, ref, toRaw } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { MessageBox } from '@element-plus/icons-vue';
import RedisServer from '../../../redis/RedisServer';
import { RedisData } from '../../../types/global';
import { toReactive } from '@vueuse/shared';
import CommonUtils from '../../../utils/utils';

const ruleFormRef = ref<FormInstance>()
type props = {
  connectVisible: boolean,
  title: string,
  key?: string,
  model?: 'create' | 'edit' | 'view',
  connectData?: any
}

const props = defineProps<props>()

const check = (rule: any, value: any, callback: any) => {
  if (!value) {
    value
    return callback(new Error('不可以为空'))
  }
}


let ruleForm = reactive<any>({
  host: '127.0.0.1',
  port: '6379',
  password: '',
  username: 'admin',
  name: 'localhost',
  key: ''
})


const rules = reactive({
  host: [{ validator: check, trigger: 'blur', required: true }],
  port: [{ validator: check, trigger: 'blur', required: true }],
})

const emits = defineEmits(['saveConnect', 'cancelConnect', 'testConnect', 'handleClose'])
const createConnect = () => {
  if (!ruleForm.host || !ruleForm.port) {
    return
  }

  // const connectStr = localStorage.getItem('connections')
  // const isCurrent = 
  // const isExist = connectStr?.includes(ruleForm.host) && connectStr?.includes(ruleForm.port)
  if (RedisServer.isExistCheck(toRaw(ruleForm))) {
    ElMessage.warning('当前服务已存在')
    return
  }
  emits('saveConnect', toRaw(ruleForm))
}
const handleClose = () => {
  console.log('初始化 :>> ',)
  emits('handleClose')
}
const afterOpen = () => {
  if (!props.connectData) return
  CommonUtils.setReactive(ruleForm, props.connectData)
}
</script>

<template>
  <el-dialog v-model="connectVisible" @opened="afterOpen" :title="title" width="800px" :before-close="handleClose">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" label-position="top"
      class="ruleForm">
      <div class="connect-form">
        <el-form-item label="地址" prop="host">
          <el-input v-model="ruleForm.host" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="ruleForm.port" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.number="ruleForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="连接名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-space>
        <el-button type="success">测试连接</el-button>
        <el-button @click="emits('cancelConnect')">取消</el-button>
        <el-button type="primary" @click="createConnect">保存连接</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<style lang='scss' scoped>
.connect-form {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-gap: 5px 10px;
}
</style>