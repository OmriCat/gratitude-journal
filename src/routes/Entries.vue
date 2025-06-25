<script lang="ts" setup>
import { Temporal } from "temporal-polyfill";
import { computed, ref } from "vue";
import type { Entry } from "@/model/model";
import { accessRepository } from "@/model/repository.ts";
import { timeAgoString } from "../human-time-ago.ts";

const repository = accessRepository();
const entries = ref<Array<Entry>>(await repository.loadData());
const sortedEntries = computed(() =>
  entries.value.sort((first, second) =>
    Temporal.Instant.compare(second.created_at, first.created_at),
  ),
);

function showTimeAgoString(zdt: Temporal.ZonedDateTime): string {
  const timeAgoResult = timeAgoString(Temporal.Now.zonedDateTimeISO(), zdt);
  if (timeAgoResult.isOk()) return timeAgoResult.value;
  return "Unable to show when this entry was created!";
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Entry</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="entry of sortedEntries"
        :key="entry.created_at.epochMilliseconds"
      >
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
<style scoped></style>
