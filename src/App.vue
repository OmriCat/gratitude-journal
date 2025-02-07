<script lang="ts" setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <Header />
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/entries">All entries</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>

  <footer></footer>
</template>
<style scoped></style>
