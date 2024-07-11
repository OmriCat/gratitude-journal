<script setup lang="ts">
import Inspiration from "./components/Inspiration.vue";
import { ref } from "vue";

const entryText = ref("");

function saveEntry(event: Event) {
  console.log(entryText.value);
}
</script>

<template>
  <header>
    <h1>Gratitude Journal</h1>
  </header>

  <main>
    <Inspiration />
    <div>
      <input type="text" @change=""/>
      <button @click="saveEntry">Save</button>
    </div>
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

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items:;
    flex-wrap: wrap;
  }
}
</style>
