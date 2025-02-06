<script lang="ts" setup>
import Inspiration from "@/components/InspirationItems.vue";
import Entries from "@/components/TodaysEntries.vue";
import { entries_with_date, Entry } from "@/model/model";
import { REPOSITORY_INJECTION_KEY, type Repository } from "@/model/repository";
import { shuffleArray, throwError } from "@/util";
import { Temporal } from "temporal-polyfill";
import { computed, inject, ref, watchEffect } from "vue";
import Header from "@/components/Header.vue";

const repository: Repository =
  inject(REPOSITORY_INJECTION_KEY) ?? throwError("Failure to get repository");

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
  <Header />

  <main>
    <Inspiration :entries="entriesForInspiration" />
    <div>
      <input
        v-model.trim="entryText"
        autofocus
        placeholder="What are you grateful for?"
        type="text"
        @keyup.enter="saveEntry"
      />
      <button @click="saveEntry">Save</button>
    </div>
    <Entries :entries="displayedEntries" />
  </main>

  <footer></footer>
</template>
