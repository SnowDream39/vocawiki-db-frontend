<template>
  <div class="flex flex-row justify-center gap-2 my-4">
    <el-text>P主id</el-text>
    <el-input class="w-20!" v-model="producerId" />
    <a class="text-3xl font-bold" :href="`https://voca.wiki/${entry}`" target="_blank">{{ entry }}</a>
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
import { onMounted, ref } from 'vue';
import { searchSongsByArtist } from '@/utils/vocadb';
import PSongSearchLine from '@/components/ProducerSongSelect.vue';

const producerId = ref<number>(110656)
const songs = ref<any>()
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)
const entry = ref<string>('海茶')

async function search() {
  const data = await searchSongsByArtist(producerId.value, page.value, size.value);
  songs.value = data.items
  total.value = data.totalCount

}




onMounted(search)

</script>