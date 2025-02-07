<script lang="ts" setup>
import type { Entry } from "@/model/model";
import { Temporal } from "temporal-polyfill";
import { timeAgoString } from "../human-time-ago.ts";

const { entries } = defineProps<{ entries: Entry[] }>();

function showTimeAgoString(zdt: Temporal.ZonedDateTime): string {
  const timeAgoResult = timeAgoString(Temporal.Now.zonedDateTimeISO(), zdt);
  if (timeAgoResult.isOk()) return timeAgoResult.value;
  return "Unable to show when this entry was created!";
}
</script>

<template>
  <table>
    <tbody>
      <tr v-for="entry of entries" :key="entry.created_at.epochMilliseconds">
        <td>{{ entry.title }}</td>
        <td>
          {{
            showTimeAgoString(
              entry.created_at.toZonedDateTimeISO(Temporal.Now.timeZoneId()),
            )
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
