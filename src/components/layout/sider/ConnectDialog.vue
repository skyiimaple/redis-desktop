<script setup lang='ts'>import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const check = (rule: any, value: any, callback: any) => {
  if (!value) {
    value
    return callback(new Error('Please input the value'))
  }
}


const ruleForm = reactive({
  host: '',
  port: '',
  password: '',
  username: '',
  name: '',
})

const rules = reactive({
  host: [{ validator: check, trigger: 'blur' }],
  port: [{ validator: check, trigger: 'blur' }],
  password: [{ validator: check, trigger: 'blur' }],
  username: [{ validator: check, trigger: 'blur' }],
  name: [{ validator: check, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      createConnect()
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

type props = {
  connectVisible: boolean,
  title: string
}

const props = defineProps<props>()
const emits = defineEmits(['saveConnect', 'cancelConnect', 'testConnect', 'handleClose'])
const createConnect = () => {
  // props.redisList.push(RedisServer.createRedis())
  // connectVisible.value = true
  emits('saveConnect', ruleForm)
}
const handleClose = () => {
  console.log('初始化 :>> ',)
  resetForm(ruleFormRef.value)
  emits('handleClose')
}
</script>

<template>
  <el-dialog v-model="connectVisible" :title="title" width="800px" :before-close="handleClose">
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
        <el-button type="success" @click="emits('testConnect')">测试连接</el-button>
        <el-button @click="emits('cancelConnect')">取消</el-button>
        <el-button type="primary" @click="submitForm">保存连接</el-button>
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