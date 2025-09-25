<template>
  <div class="w-full overflow-hidden flex flex-col flex-nowrap p-2 border-1 border-black dark:border-white">
    <div class="w-full flex flex-row flex-nowrap items-center">
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
          <a v-for="pv of pvs" :href="pv.url" target="_blank">
            <img :src="icons[pv.service as keyof typeof icons]" class="h-6"></img>
          </a>
        </div>
      </div>
      <div name="right" class="flex justify-center items-center">
        <el-switch v-model="selected" :loading="loading" @change="change" />
      </div>
    </div>
    <div class="w-full flex flex-col flex-nowrap transition-[height] duration-200 ease-in-out"
      :class="{ 'h-0': !selected, 'h-30': selected }">
      <el-form v-if="selected">
        <el-form-item label="条目">
          <el-input v-model="entry" placeholder="Vocawiki条目名，下划线改为空格" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="description" placeholder="使用wikitext格式" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="image" placeholder="默认图片显示不出或者有更好图片时使用" />
        </el-form-item>
        <el-form-item>
          <div class="w-full flex justify-end">
            <el-button type="primary" @click="update">更新</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { selectThumbnailFromPvs, validatePv } from '@/utils/vocadb';
import { addPSong, checkPSong, deletePSong, upsertSongs } from '@/utils/vocawiki';
import { ElSwitch, ElInput, ElMessage, ElButton, ElForm, ElFormItem } from 'element-plus';
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
const entry = ref<string>("")
const description = ref<string>("")
const image = ref<string>("")
const pvs = props.song.pvs.filter(validatePv)
const pvUrl = selectThumbnailFromPvs(pvs)

async function check() {
  loading.value = true
  const data = await checkPSong(props.producerId, props.song.id)
  if (data) {
    description.value = data.description
    entry.value = data.entry
    selected.value = true
  } else {
    selected.value = false
  }
  loading.value = false
}


async function upload() {
  loading.value = true
  await addPSong({ producer_id: props.producerId, song_id: props.song.id, entry: entry.value, description: description.value, image: image.value })
  selected.value = true
  loading.value = false
}

async function change(value: string | boolean | number) {
  if (value == true) {
    await upload()
  } else {
    loading.value = true
    await deletePSong({ producer_id: props.producerId, song_id: props.song.id })
    selected.value = false
    loading.value = false
  }
}

async function update() {
  await upsertSongs([{ id: props.song.id, entry: entry.value, image: image.value }])
  ElMessage.success("更新成功")
}

onMounted(check)

</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>