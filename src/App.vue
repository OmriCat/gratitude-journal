<script setup lang="ts">
import Inspiration from "@/components/InspirationItems.vue";
import Entries from "@/components/TodaysEntries.vue";
import { Entry, entries_with_date } from "@/model/model";
import { REPOSITORY_INJECTION_KEY } from "@/model/repository";
import { computed, inject, ref, watchEffect } from "vue";
import { Temporal } from "temporal-polyfill";
import { shuffleArray } from "@/util";

const repository = inject(REPOSITORY_INJECTION_KEY)!;

const entryText = ref("");
const entries = ref<Entry[]>(repository.loadData());

const dateToDisplay = ref(Temporal.Now.plainDateISO());
const displayedEntries = computed(() =>
  entries_with_date(entries.value, dateToDisplay.value),
);

watchEffect(() => repository.storeData(entries.value));

function saveEntry() {
  const value = entryText.value.trim();
  if (value) {
    entries.value.push(Entry.now(entryText.value));
    entryText.value = "";
  }
}

// Deliberately non-reactive so this remains constant for each page load
const entriesForInspiration = shuffleArray(entries.value).slice(0, 3);
</script>

<template>
  <header class="page-title">
    <h1>Gratitude Journal</h1>
  </header>

  <main>
    <Inspiration :entries="entriesForInspiration" />
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
    <Entries :entries="displayedEntries" />
  </main>

  <footer></footer>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
