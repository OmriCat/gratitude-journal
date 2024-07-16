<script setup lang="ts">
import Inspiration from "./components/Inspiration.vue";
import { Entry, entries_with_date } from "./model/model.ts";
import { loadData, storeData } from "./model/repository.ts";
import Entries from "./components/Entries.vue";
import { computed, ref, watchEffect } from "vue";
import { Instant, LocalDate } from "@js-joda/core";

const entryText = ref("");
const entries = ref(loadData());
const dateToDisplay = ref(LocalDate.now());

const displayedEntries = computed(() =>
  entries_with_date(entries.value, dateToDisplay.value)
);

watchEffect(() => storeData(entries.value));

function saveEntry(e) {
  const value = entryText.value.trim();
  if (value) {
    entries.value.push(Entry.now(entryText.value));
    entryText.value = "";
  }
}
</script>

<template>
  <header>
    <h1>Gratitude Journal</h1>
  </header>

  <main>
    <Inspiration />
    <div>
      <input type="text" v-model.lazy.trim="entryText"  autofocus placeholder="What are you grateful for?" @keyup.enter="saveEntry"/>
      <button @click="saveEntry">Save</button>
    </div>
    <Entries :entries="entries" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
