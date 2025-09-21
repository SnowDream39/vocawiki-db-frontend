<template>
  <div class="flex flex-row justify-center gap-2 my-4">
    <el-text>P主条目</el-text>
    <el-input class="w-60!" v-model="entry" />
    <el-text>P主id</el-text>
    <el-text class="w-20!">{{ producerId }}</el-text>
  </div>
  <div class="flex flex-row flex-wrap justify-center max-w-[1200px]">
    <PSongSearchLine v-for="(song, index) of songs" :producerId="producerId" :song="song" :key="song.id" />
  </div>
  <div class="flex flex-row justify-center">
    <el-pagination layout="prev, pager, next, total" v-model:current-page="page" :page-size="size" :total="total"
      @change="search" />
  </div>
</template>

<script setup lang="ts">
import { ElInput, ElText, ElPagination } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { searchSongsByArtist } from '@/utils/vocadb';
import PSongSearchLine from '@/components/ProducerSongSelect.vue';
import { getProducerId } from '@/utils/vocawiki';

const songs = ref<any>()
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)
const entry = ref<string>('海茶')
const producerId = ref<number>(110656)

async function search() {
  const data1 = await getProducerId(entry.value)
  producerId.value = data1
  const data2 = await searchSongsByArtist(producerId.value, page.value, size.value);
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