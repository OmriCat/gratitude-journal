import { Temporal } from "temporal-polyfill";

export class Entry {
  title!: string;
  created_at: Temporal.Instant;
  private constructor(title: string, created_at: Temporal.Instant) {
    this.title = title;
    this.created_at = created_at;
  }

  static now(title: string): Entry {
    return new Entry(title, Temporal.Now.instant());
  }
}

export function entries_with_date(
  entries: Entry[],
): Entry[] {
  return entries.filter((entry) =>
  );
}
