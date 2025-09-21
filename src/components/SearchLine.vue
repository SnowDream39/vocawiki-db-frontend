<template>
  <div class="flex flex-row flex-nowrap m-3">
    <div class="w-1/4">
      <el-input v-model="name" />
      <a :href="`https://vj-wiki.top/${entry}`" target="_blank">
        <el-button>条目</el-button>
      </a>
      <a :href="`https://vocadb.net/Search?filter=${name}&searchType=Artist&sort=SongRating`" target="_blank">
        <el-button>搜索</el-button>
      </a>
    </div>
    <div class="w-3/4 flex flex-row gap-4 items-start">
      <ProducerCard v-for="producer in results" :data="producer" :selected="producer.id === id"
        @update-id="handleUpdateId" />
      <el-input class="w-20!" v-model="id" placeholder="id" />
    </div>
  </div>


</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import ProducerCard from './ProducerCard.vue';
import { ElInput, ElButton } from 'element-plus';
const props = defineProps<{
  entry: string
}>()

const name = ref<string>('')
const results = ref<any[]>()
const id = defineModel<number>()

function handleUpdateId(newId: number) {
  id.value = newId
}

async function search(name: string) {
  const response = await axios.get('https://vocadb.net/api/artists', {
    params: {
      query: name,
      fields: 'MainPicture',
      preferAccurateMatches: true,
      maxResults: 3,
      sort: 'SongRating'
    }
  })
  results.value = response.data.items;
  if (results.value!.length === 1) {
    id.value = results.value![0].id;
  }
}

async function init() {
  name.value = props.entry
  await search(name.value)
}

onMounted(init)

watch(name, async (newName: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  if (name.value === newName) await search(name.value)
})

</script>