<template>
  <el-card class="login-card">
    <h2 style="text-align:center;">欢迎登录</h2>
    <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
      <el-form-item label="邮箱" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.remember">记住我</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button text @click="$emit('switch')">还没有账号？点此注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { login } from '../../utils/user'
import router from '@/router'
import { ElCard } from 'element-plus'

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loginForm = ref()

const onSubmit = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      const access_token = await login(form)
      localStorage.setItem('access_token', access_token)
      ElMessage({
        message: '登录成功',
        type: 'success',
        duration: 1000,
        showClose: false
      })

    } else {
      ElMessage({
        message: '登录失败',
        type: 'error',
        duration: 1000,
        showClose: false
      })
    }
  })
}
</script>

<style scoped>
.login-card {
  width: 400px;
  padding: 20px;
}
</style>
