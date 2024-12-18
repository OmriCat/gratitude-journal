<script setup lang="ts">
import { Entry } from "@/model/model";

const { entries } = defineProps<{ entries: Entry[] }>();
</script>

<template>
  <ul>
    <!-- Entries are explicitly randomly ordered so no key is needed -->
    <!-- eslint-disable-next-line vue/require-v-for-key -->
    <li v-for="entry of entries">{{ entry.title }}</li>
  </ul>
</template>
