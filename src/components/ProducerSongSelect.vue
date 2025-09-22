<template>
  <div
    class=" w-[90%] sm:w-[500px] overflow-hidden flex flex-row flex-nowrap p-2 border-1 border-black dark:border-white">

    <div name="left" class="w-28 h-21">
      <a :href="`https://vocadb.net/S/${song.id}`" target="_blank">
        <img v-if="pvUrl" :src="pvUrl" referrerpolicy="no-referrer"></img>
        <div v-else class="w-full h-full bg-gray dark:bg-gray">无可用图片</div>
      </a>
    </div>
    <div name="middle" class="flex flex-col flex-1 items-start">
      <div class="space-x-4">
        <span>{{ song.songType }}</span>
        <span>{{ song.defaultName }}</span>
      </div>
      <div>{{ song.artistString }}</div>
      <div class="flex flex-row flex-nowrap items-center space-x-2">
        <a v-for="pv of song.pvs" :href="pv.url" target="_blank">
          <img :src="icons[pv.service as keyof typeof icons]" class="h-6"></img>
        </a>
      </div>
    </div>
    <div name="right" class="flex justify-center items-center">
      <el-switch v-model="selected" :loading="loading" @change="change" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { selectThumbnailFromPvs } from '@/utils/vocadb';
import { addPSong, checkPSong, deletePSong } from '@/utils/vocawiki';
import { ElSwitch } from 'element-plus';
import { onMounted, ref } from 'vue';

const icons = {
  Youtube: "https://voca.wiki/images/6/60/YouTube_Icon_Red.svg",
  Bilibili: "https://voca.wiki/images/f/f5/Bilibili_Icon.svg",
  SoundCloud: "https://voca.wiki/images/7/7d/SoundCloud_Icon.svg",
  NicoNicoDouga: "https://voca.wiki/images/e/e0/Niconico_Logo_%282020%29.svg",
};

const props = defineProps<{
  song: any,
  producerId: number
}>()
const selected = ref<boolean>(false)
const loading = ref<boolean>(true)
const pvUrl = selectThumbnailFromPvs(props.song.pvs)

async function check() {
  loading.value = true
  const data = await checkPSong(props.producerId, props.song.id)
  selected.value = data
  loading.value = false
}

async function change(value: string | boolean | number) {
  if (value == true) {
    loading.value = true
    await addPSong({ producer_id: props.producerId, song_id: props.song.id })
    selected.value = true
    loading.value = false
  } else {
    loading.value = true
    await deletePSong({ producer_id: props.producerId, song_id: props.song.id })
    selected.value = false
    loading.value = false
  }
}

onMounted(check)

</script>