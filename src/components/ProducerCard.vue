<template>
  <div class="flex flex-row" ref="card">
    <img :src="data.mainPicture.urlTinyThumb" alt="portrait" />
    <div>
      <div>{{ data.defaultName }}</div>
      <div class="flex flex-row">

        <el-button @click="select">选择</el-button>
        <a class="flex flex-col flex-nowrap" target="_blank" :href="`https://vocadb.net/Ar/${data.id}`">
          <el-button>条目</el-button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus';
import { ref, watch } from 'vue';
const props = defineProps<{
  data: any
}>()
const id = defineModel<number>();

const card = ref()

function select() {
  id.value = props.data.id
}

watch(id, () => {
  if (id.value === props.data.id) {
    card.value.classList.toggle('active')
  }
})
</script>

<style scoped>
.active {
  background-color: yellow;
}
</style>