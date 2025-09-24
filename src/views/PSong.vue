<template>
  <div class="flex flex-row justify-center gap-2 my-4">
    <el-text>P主条目</el-text>
    <el-input class="w-60!" v-model="entry" />
    <el-text>P主id</el-text>
    <el-text class="w-20!">{{ producerId }}</el-text>
  </div>
  <div class="flex flex-row justify-center gap-2 my-4">
    <el-text>歌曲类型</el-text>
    <el-checkbox-group v-model="selectedSongTypes" @change="search">
      <el-checkbox v-for="(songType, index) of songTypes" :key="index" :label="songType">{{ songType }}</el-checkbox>
    </el-checkbox-group>
  </div>
  <div class="flex flex-row flex-wrap justify-center max-w-[1200px]">
    <PSongSearchLine v-for="(song, index) of songs" :producerId="producerId" :song="song" :key="song.id" />
  </div>
  <div class="flex flex-row justify-center">
    <el-pagination layout="sizes, prev, pager, next, total" v-model:current-page="page" v-model:page-size="size"
      :total="total" @change="search" :page-sizes="[10, 20, 50, 100]" />
  </div>
  <Manual>
    <li>编辑数据库，需要点击右上角图标登录。</li>
    <li>首先输入P主条目名。P主名的格式为，首字母大写，所有下划线转为空格。</li>
    <li>如果P主已经在数据库中录入，就会自动搜索该P主在 VocaDB 的歌曲。</li>
    <li>选择符合 Vocawiki 认定标准的歌曲作品。</li>
  </Manual>
</template>

<script setup lang="ts">
import { ElInput, ElText, ElPagination } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { searchSongsByArtist } from '@/utils/vocadb';
import PSongSearchLine from '@/components/ProducerSongSelect.vue';
import { getProducerId } from '@/utils/vocawiki';
import Manual from '@/components/Manual.vue';
import { ElCheckbox, ElCheckboxGroup } from 'element-plus';

const songTypes = [
  "Original",
  "Remix",
  "Remaster",
  "Cover",
  "Instrumental",
  "Mashup",
  "MusicPV",
  "DramaPV",
  "Other",
];

const songs = ref<any>()
const page = ref<number>()
const size = ref<number>(10)
const total = ref<number>(0)
const entry = ref<string>('海茶')
const producerId = ref<number>(110656)
const selectedSongTypes = ref<string[]>(['Original', 'Remix', 'Remaster', 'Cover'])

async function search() {
  const data1 = await getProducerId(entry.value)
  producerId.value = data1
  const data2 = await searchSongsByArtist(producerId.value, page.value, size.value, {
    songTypes: selectedSongTypes.value
  });
  songs.value = data2.items
  total.value = data2.totalCount
}

onMounted(search)

watch(entry, async (newEntry) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (newEntry === entry.value) {
    await search()
  }
})


</script>