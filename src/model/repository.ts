import { Temporal } from "temporal-polyfill";
import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { Entry } from "@/model/model";
import { throwError } from "@/util.ts";

import Instant = Temporal.Instant;

const STORAGE_KEY = "gratitude-journal";

export const REPOSITORY_INJECTION_KEY: InjectionKey<Repository> = Symbol(
  "repository",
) as InjectionKey<Repository>;

export interface Repository {
  loadData(): Promise<Entry[]>;

  storeData(entries: Entry[]): Promise<void>;
}

export function accessRepository(): Repository {
  return (
    inject(REPOSITORY_INJECTION_KEY) ?? throwError("Unable to load repository")
  );
}

export class LocalStorageRepository implements Repository {
  async loadData(): Promise<Entry[]> {
    return new Promise((resolve, _reject) => {
      const data: string = localStorage.getItem(STORAGE_KEY) ?? "";
      const parsed = JSON.parse(data || "[]", (key, value) => {
        if (key === "created_at" && typeof value === "string") {
          return Instant.from(value);
        }
        return value;
      });
      resolve(parsed);
    });
  }

  async storeData(entries: Entry[]): Promise<void> {
    return new Promise(() => {
      const json = JSON.stringify(entries);
      localStorage.setItem(STORAGE_KEY, json);
    });
  }
}
