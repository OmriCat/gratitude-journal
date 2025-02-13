<script lang="ts" setup>
import InspirationItems from "@/components/InspirationItems.vue";
import SimpleEntriesList from "@/components/SimpleEntriesList.vue";
import { Entry, entries_with_date } from "@/model/model.ts";
import { accessRepository } from "@/model/repository.ts";
import { shuffleArray } from "@/util.ts";
import { Temporal } from "temporal-polyfill";
import { computed, ref, watchEffect } from "vue";

const repository = accessRepository();

const entryText = ref("");
const entries = ref<Entry[]>(await repository.loadData());

const dateToDisplay = ref(Temporal.Now.plainDateISO());
const displayedEntries = computed(() =>
  entries_with_date(entries.value, dateToDisplay.value),
);

watchEffect(async () => await repository.storeData(entries.value));

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

    <InspirationItems :entries="entriesForInspiration" />
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
    <SimpleEntriesList :entries="displayedEntries" />
</template>
