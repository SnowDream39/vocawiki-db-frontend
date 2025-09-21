<template>
  <div class="flex flex-row" :class="{ active: selected }" ref="card">
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
import { ref } from 'vue';
const props = defineProps<{
  data: any,
  selected: boolean
}>()
const emit = defineEmits(['updateId'])
const card = ref()

function select() {
  emit('updateId', props.data.id)
}

</script>

<style scoped>
.active {
  background-color: yellow;
}
</style>