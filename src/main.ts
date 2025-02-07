import "./assets/main.css";

import App from "@/App.vue";
import { createApp } from "vue";
import {
  LocalStorageRepository,
  REPOSITORY_INJECTION_KEY,
  type Repository,
} from "./model/repository";

const repository: Repository = new LocalStorageRepository();

createApp(App).provide(REPOSITORY_INJECTION_KEY, repository).mount("#app");
