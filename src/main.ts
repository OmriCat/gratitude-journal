import "./assets/main.css";

import App from "@/App.vue";
import Entries from "@/routes/Entries.vue";
import Home from "@/routes/Home.vue";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import {
  LocalStorageRepository,
  REPOSITORY_INJECTION_KEY,
  type Repository,
} from "./model/repository";

const repository: Repository = new LocalStorageRepository();

const routes = [
  { path: "/", component: Home },
  { path: "/entries", component: Entries },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
  .provide(REPOSITORY_INJECTION_KEY, repository)
  .use(router)
  .mount("#app");
