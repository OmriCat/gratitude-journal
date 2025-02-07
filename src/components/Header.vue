<template>
  <header class="page-title">
    <h1>Gratitude Journal</h1>
  </header>
</template>
<style scoped>
header {
  line-height: 1.5;
}

.page-title h1 {
  font-weight: 600;
  font-size: 3rem;
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
