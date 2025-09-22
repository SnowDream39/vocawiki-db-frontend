<template>
  <div class="w-full flex justify-center items-center">
    <el-input class="m-4" type="textarea" v-model="input" ref="inputElement" placeholder="在这里输入P主条目名，以顿号分隔" />
  </div>
  <div>
    <SearchLine v-for="(entry, index) of entries" :entry="entry" v-model="ids[index]" :key="entry" />
  </div>
  <el-button @click="submit">提交</el-button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import SearchLine from '@/components/ProducerSearchLine.vue';
import axios from 'axios';
import { upsertProducers } from '@/utils/vocawiki';

const input = ref<string>('')
const ids = ref<number[]>([])
const entries = computed<string[]>(() => {
  if (input.value.length > 0)
    return input.value?.split('、').map((item: string) => item.trim())
  else
    return []
})
const inputElement = ref()

async function submit() {
  const combined = entries.value.map((value: string, index: number) => ({
    id: ids.value[index],
    entry: value
  }))
  const response = await upsertProducers(combined)
  ElMessage({
    message: '已成功更新',
    type: 'success'
  })
}

async function init() {

}

onMounted(init)



</script>