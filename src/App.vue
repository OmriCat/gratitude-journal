<script setup lang="ts">
import Inspiration from "./components/Inspiration.vue";
import { Entry, entries_with_date } from "./model/model";
import { loadData, storeData } from "./model/repository";
import Entries from "./components/Entries.vue";
import { computed, ref, watchEffect } from "vue";
import { Temporal } from "temporal-polyfill";

const entryText = ref("");
const entries = ref<Entry[]>(loadData());
const dateToDisplay = ref(Temporal.Now.plainDateISO());

const displayedEntries = computed(() =>
  entries_with_date(entries.value, dateToDisplay.value)
);

watchEffect(() => storeData(entries.value));

function saveEntry(e: Event) {
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
    <Inspiration :entries="entries" />
    <div>
      <input
        type="text"
        v-model.trim="entryText"
        autofocus
        placeholder="What are you grateful for?"
        @keyup.enter="saveEntry"
      />
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
