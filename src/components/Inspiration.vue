<script setup lang="ts">
import { Entry } from "@/model/model";
import { computed } from "vue";

const props = defineProps<{ entries: Entry[] }>();

const inspiration_entries = computed(() => {
  let shuffled = shuffleArray(props.entries);
  return shuffled.slice(0, 3);
});

function shuffleArray(array: any[]): any[] {
  let shuffled = array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return shuffled;
}
</script>

<template>
  <ul>
    <li v-for="entry of inspiration_entries">{{ entry.title }}</li>
  </ul>
</template>
