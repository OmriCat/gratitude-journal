<script setup lang="ts">
import { Entry } from "@/model/model";
import { computed, inject } from "vue";

const props = defineProps<{ entries: Entry[] }>();
</script>

<template>
  <ul>
    <li v-for="entry of entries">{{ entry.title }}</li>
  </ul>
</template>
