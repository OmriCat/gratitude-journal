import { Instant, LocalDate } from "@js-joda/core";

export class Entry {
  title!: String;
  created_at!: Instant;
  private constructor(title: String, created_at: Instant) {
    this.title = title;
    this.created_at = created_at;
  }

  static now(title: String): Entry {
    return new Entry(title, Instant.now());
  }
}

export function entries_with_date(entries: Entry[], date: LocalDate): Entry[] {
  return entries.filter((entry) =>
    date.equals(LocalDate.ofInstant(entry.created_at))
  );
}
