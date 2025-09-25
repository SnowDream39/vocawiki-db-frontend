<template>
  <div
    class="overflow-hidden flex flex-col flex-nowrap rounded-xl drop-shadow-md dark:border-white dark:border-1 hover:drop-shadow-xl transition duration-300 bg-zinc-50 dark:bg-zinc-800"
    ref="card">
    <div class="w-full aspect-ratio-16/9">
      <a :href="`https://vocadb.net/S/${song.id}`" target="_blank">
        <img v-if="pvUrl" :src="pvUrl" referrerpolicy="no-referrer"></img>
        <div v-else class="w-full h-full bg-gray dark:bg-gray">无可用图片</div>
      </a>
    </div>
    <div>{{ song.songType }}</div>
    <div class="text-nowrap overflow-hidden">{{ song.defaultName }}</div>
    <div class="text-nowrap overflow-hidden">{{ song.artistString }}</div>
    <div class="flex flex-row flex-nowrap justify-between">
      <div class="flex flex-row flex-nowrap items-center space-x-2">
        <a v-for="pv of pvs" :href="pv.url" target="_blank">
          <img :src="icons[pv.service as keyof typeof icons]" class="h-6"></img>
        </a>
      </div>
      <div class="flex justify-center items-center">
        <el-switch v-model="selected" :loading="loading" @change="change" />
      </div>
    </div>
    <div class="w-full flex flex-col flex-nowrap transition-[height] duration-200 ease-in-out"
      :class="{ 'h-0': !showDetail, 'h-32': showDetail }">
      <el-form v-if="selected">
        <el-form-item label="条目">
          <el-input v-model="entry" placeholder="下划线改为空格" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="description" placeholder="使用wikitext格式" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="image" placeholder="替换默认图片" />
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
import { onMounted, ref, watch } from 'vue';

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

const card = ref()
const selected = ref<boolean>(false)
const loading = ref<boolean>(true)
const entry = ref<string>("")
const description = ref<string>("")
const image = ref<string>("")
const showDetail = ref<boolean>(false)
const emit = defineEmits<{
  render: []
}>()

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

onMounted(async () => {
  await check()
  const el = card.value as HTMLElement;

  el.addEventListener('mouseenter', () => {
    showDetail.value = true
  });

  el.addEventListener('mouseleave', () => {
    showDetail.value = false
  });

  // 手机点击：点自己就激活，点别的地方就取消
  el.addEventListener('touchstart', (e) => {
    e.stopPropagation(); // 防止冒泡到 document
    showDetail.value = true
  });

  document.addEventListener('touchstart', (e: any) => {
    if (!el.contains(e.target)) {
      showDetail.value = false
    }
  });

})

watch(showDetail, async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  emit("render");
})


</script>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>