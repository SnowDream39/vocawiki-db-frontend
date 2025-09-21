<template>
  <div class="flex flex-row" :class="{ active: selected }" ref="card">
    <img :src="thumb" alt="portrait" />
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
import { computed, ref } from 'vue';
const props = defineProps<{
  data: any,
  selected: boolean
}>()
const emit = defineEmits(['updateId'])
const card = ref()

const thumb = computed(() => {
  if (props.data) {
    if (props.data.mainPicture) {
      const mainPicture = props.data.mainPicture;
      return mainPicture.urlTinyThumb
    }
  }
})

function select() {
  emit('updateId', props.data.id)
}

</script>

<style scoped>
.active {
  background-color: yellow;
}
</style>