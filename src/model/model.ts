import { Temporal } from "temporal-polyfill";

export class Entry {
  title!: String;
  created_at: Temporal.Instant;
  private constructor(title: String, created_at: Temporal.Instant) {
    this.title = title;
    this.created_at = created_at;
  }

  static now(title: String): Entry {
    return new Entry(title, Temporal.Now.instant());
  }
}

export function entries_with_date(
  entries: Entry[],
  date: Temporal.PlainDate
): Entry[] {
  return entries.filter((entry) =>
    date.equals(entry.created_at.toZonedDateTimeISO("UTC"))
  );
}
