<script setup lang="ts">
import Entry from "../model/model.ts";
import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
const props = defineProps<{ entries: Entry[] }>();

const formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
</script>

<template>
  <table>
    <tbody>
      <tr v-for="entry of entries">
        <td>{{ entry.title }}</td>
        <td>
          {{ LocalDateTime.ofInstant(entry.created_at).format(formatter) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
