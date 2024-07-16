import { Instant, LocalDateTime } from "@js-joda/core";
import type { Entry } from "./model";
import { Err, Result } from "ts-results";

const STORAGE_KEY = "gratitude-journal";

export function loadData(): Entry[] {
  var data = localStorage.getItem(STORAGE_KEY);
  if (data === "undefined") {
    data = "[]";
  }
  const parsed = JSON.parse(data || "[]", (key, value) => {
    if (key === "created_at" && typeof value === "string") {
      return Instant.parse(value);
    } else {
      return value;
    }
  });
  return parsed;
}

export function storeData(entries: Entry[]) {
  const json = JSON.stringify(entries);
  localStorage.setItem(STORAGE_KEY, json);
}
