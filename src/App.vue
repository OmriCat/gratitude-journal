<script setup lang="ts">
import Inspiration from "./components/Inspiration.vue";
import Entry from "./model/model.ts";
import Entries from "./components/Entries.vue";
import { ref } from "vue";

const entryText = ref("");
const repository = ref<Entry>([]);

function saveEntry() {
  console.log(entryText.value);
  repository.value.push({ title: entryText.value, created_at: Date.now() });
  entryText.value = "";
}
</script>

<template>
  <header>
    <h1>Gratitude Journal</h1>
  </header>

  <main>
    <Inspiration />
    <div>
      <input type="text" v-model.lazy.trim="entryText" />
      <button @click="saveEntry">Save</button>
    </div>
    <Entries :entries="repository" />
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
