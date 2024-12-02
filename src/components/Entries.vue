<script setup lang="ts">
import { Entry } from "@/model/model";
import { Temporal } from "temporal-polyfill";
import { computed } from "vue";
const props = defineProps<{ entries: Entry[] }>();
</script>

<template>
  <table>
    <tbody>
      <tr v-for="entry of entries">
        <td>{{ entry.title }}</td>
        <td>
          {{ entry.created_at.toZonedDateTimeISO(Temporal.Now.timeZoneId()) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
