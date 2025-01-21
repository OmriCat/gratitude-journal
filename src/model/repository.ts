import { Temporal } from "temporal-polyfill";
import Instant = Temporal.Instant;
import type { Entry } from "@/model/model";
import type { InjectionKey } from "vue";

const STORAGE_KEY = "gratitude-journal";

export const REPOSITORY_INJECTION_KEY: InjectionKey<Repository> = Symbol(
  "repository",
) as InjectionKey<Repository>;

export interface Repository {
  loadData(): Entry[];
  storeData(entries: Entry[]): void;
}

export class LocalStorageRepository implements Repository {
  loadData(): Entry[] {
    let data = localStorage.getItem(STORAGE_KEY);
    if (data === "undefined") {
      data = "[]";
    }
    const parsed = JSON.parse(data || "[]", (key, value) => {
      if (key === "created_at" && typeof value === "string") {
        return Instant.from(value);
      } else {
        return value;
      }
    });
    return parsed;
  }

  storeData(entries: Entry[]): void {
    const json = JSON.stringify(entries);
    localStorage.setItem(STORAGE_KEY, json);
  }
}
