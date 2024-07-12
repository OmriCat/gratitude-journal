<script setup lang="ts">
import Entry from "../model/model.ts";
const props = defineProps<{entries: [Entry]}>();
</script>

<template>
  <table>
    <tbody>
    <tr v-for="entry of entries">
        <td>{{ entry.title }}</td>
        <td>{{ entry.created_at }}</td>
    </tr>
    </tbody>
  </table>
</template>
