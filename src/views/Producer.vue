<template>
  <div class="w-full flex justify-center items-center">
    <el-input class="m-4" type="textarea" v-model="input" ref="inputElement" placeholder="在这里输入P主条目名，以顿号分隔" />
  </div>
  <div>
    <SearchLine v-for="(entry, index) of entries" :entry="entry" v-model="ids[index]" :key="entry" />
  </div>
  <el-button @click="submit">提交</el-button>
  <Manual>
    <li>编辑数据库，需要点击右上角图标登录。</li>
    <li>首先输入P主条目名，以顿号分隔。P主名的格式为，首字母大写，把原有条目名中的所有下划线转为空格。</li>
    <li>然后，左边的输入框会自动填入每个P主的条目名。网页会自动利用这个名字在 VocaDB 中搜索。</li>
    <li>如果搜索结果不是你想要的，你可以修改输入框中的内容，但是上传到数据库的条目名还是以最上面的输入框中的文字为准。</li>
    <li>如果有多个搜索结果，你需要自己选择一个正确的。如果搜索结果中没有正确的，你需要自行在右边的输入框输入正确的 VocaDB id。如果 VocaDB 没有该P主的条目，你应该自行创建一个条目。</li>
    <li>全部选择完成之后，点击提交按钮即可上传到数据库。</li>
  </Manual>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import SearchLine from '@/components/ProducerSearchLine.vue';
import axios from 'axios';
import { upsertProducers } from '@/utils/vocawiki';
import Manual from '@/components/Manual.vue';

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