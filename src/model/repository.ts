import type { Entry } from "@/model/model";
import { Temporal } from "temporal-polyfill";
import type { InjectionKey } from "vue";
import Instant = Temporal.Instant;

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
    const data: string = localStorage.getItem(STORAGE_KEY) ?? "";

    return JSON.parse(data || "[]", (key, value) => {
      if (key === "created_at" && typeof value === "string") {
        return Instant.from(value);
      }
      return value;
    });
  }

  storeData(entries: Entry[]): void {
    const json = JSON.stringify(entries);
    localStorage.setItem(STORAGE_KEY, json);
  }
}
