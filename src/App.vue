<template>
  <el-config-provider :locale="zhCn">
    <Header />
    <main class="flex flex-col items-center">
      <router-view />
    </main>
  </el-config-provider>
  <Footer />
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { RouterView } from 'vue-router';
import Header from './components/header/Header.vue';
import Footer from './components/Footer.vue';
</script>
