<template>
  <div class="flex flex-row justify-center gap-2 my-4">
    <el-text>P主条目</el-text>
    <el-input class="w-60!" v-model.lazy="entry" @change="search" />
    <el-text>P主id</el-text>
    <el-text class="w-20!">{{ producerId }}</el-text>
  </div>
  <el-form>
    <el-form-item label="歌曲类型">
      <el-checkbox-group v-model="selectedSongTypes" @change="search">
        <el-checkbox v-for="(songType, index) of songTypes" :key="index" :label="songType">{{ songType
        }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="筛选条件">
      <el-checkbox-group v-model="selectedFilters" @change="filterData">
        <el-checkbox v-for="(fn, key) of filters" :key="key" :label="key">{{ key
        }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
  <div class="w-full px-3 flex flex-row justify-end">
    <el-button type="primary" @click="selectAll">全选</el-button>
  </div>
  <Waterfall :list="songs" :breakpoints="breakpoints" ref="waterfall">
    <template #default="{ item, index }">
      <PSongSearchLine :producerId="producerId" :song="item" :key="item.id" v-model="selectStateList[index]"
        @render="render" ref="card" />
    </template>
  </Waterfall>
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
import { ElInput, ElText, ElPagination, ElMessage } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { searchSongsByArtist, validatePv } from '@/utils/vocadb';
import PSongSearchLine from '@/components/ProducerSongCard.vue';
import { getProducerId } from '@/utils/vocawiki';
import Manual from '@/components/Manual.vue';
import { ElCheckbox, ElCheckboxGroup, ElForm, ElFormItem, ElButton } from 'element-plus';
import { Waterfall } from 'vue-waterfall-plugin-next'

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

const filters = {
  '有视频': (song: any) => song.pvs.filter((pv: any) => pv.service !== "SoundCloud").length > 0,
  '有虚拟歌手': (song: any) => song.artists.filter((artist: any) => artist.categories === 'Vocalist' && (artist.artist ? (artist.artist.artistType !== 'OtherVocalist') : true)).length > 0,
}

const breakpoints = {
  2500: { rowPerView: 8 },
  2000: { rowPerView: 7 },
  1600: { rowPerView: 6 },
  1300: { rowPerView: 5 },
  1000: { rowPerView: 4 },
  700: { rowPerView: 3 },
  500: { rowPerView: 2 },
  300: { rowPerView: 1 },
}

const originalData = ref<any[]>([])
const songs = ref<any>()
const page = ref<number>()
const size = ref<number>(10)
const total = ref<number>(0)
const entry = ref<string>('DECO*27')
const producerId = ref<number>(110656)
const selectedSongTypes = ref<string[]>(['Original', 'Remix', 'Remaster', 'Cover'])
const selectedFilters = ref<(keyof typeof filters)[]>(["有视频"])
const waterfall = ref()
const selectStateList = ref<boolean[] | null[]>([])
const allSelected = ref(false)

function selectAll() {
  allSelected.value = !allSelected.value
  selectStateList.value = Array(songs.value.length).fill(allSelected.value)
}

async function search() {
  allSelected.value = false
  ElMessage.info('正在搜索...')
  const data1 = await getProducerId(entry.value)
  producerId.value = data1
  const data2 = await searchSongsByArtist(producerId.value, page.value, size.value, {
    songTypes: selectedSongTypes.value
  });
  originalData.value = data2.items
  total.value = data2.totalCount
  await filterData()
}

async function filterData() {
  let items = originalData.value
  for (const item of items) {
    item.pvs = item.pvs.filter(validatePv)
  }
  for (const filter of selectedFilters.value) {
    items = items.filter(filters[filter])
  }
  selectStateList.value = Array(items.length).fill(null)
  songs.value = items
  await new Promise(resolve => setTimeout(resolve, 300))
  render()
}

function render() {
  waterfall.value?.renderer()
}

onMounted(search)
</script>