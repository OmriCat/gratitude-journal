import { Temporal } from "temporal-polyfill";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { expect, test } from "vitest";
import { TimeAgoError, timeAgoString } from "@/human-time-ago.ts";

const FIXED_DATE = Temporal.ZonedDateTime.from("2025-01-01T12:00[UTC]");

type TestCase = {
  later: Temporal.ZonedDateTime;
  earlier: Temporal.ZonedDateTime;
  expected: Result<string, TimeAgoError>;
  message: string;
};

function dur(
  duration: Temporal.DurationLike,
  expected: Result<string, TimeAgoError>,
): TestCase {
  return zdt(FIXED_DATE, FIXED_DATE.subtract(duration), expected);
}

function zdt(
  later: Temporal.ZonedDateTimeLike | string,
  earlier: Temporal.ZonedDateTimeLike | string,
  expected: Result<string, TimeAgoError>,
): TestCase {
  const expectedMessage = expected.isOk()
    ? expected.value
    : expected.error.toString();
  return {
    later: Temporal.PlainDateTime.from(later).toZonedDateTime("UTC"),
    earlier: Temporal.PlainDateTime.from(earlier).toZonedDateTime("UTC"),
    expected: expected,
    message: `returns ${expectedMessage} for {${later.toString()}, ${earlier.toString()}`,
  };
}

test.for<TestCase>([
  dur({ seconds: -30 }, Err(TimeAgoError.LaterBeforeEarlier)),
  dur({ seconds: 30 }, Ok("Just now")),
  dur({ seconds: 61 }, Ok("1 minute ago")),
  dur({ minutes: 30 }, Ok("30 minutes ago")),
  dur({ minutes: 365 }, Ok("6 hours ago")),
  dur({ minutes: 60 }, Ok("1 hour ago")),
  zdt("2025-01-01T06:00", "2025-01-01T04:00", Ok("2 hours ago")),
  zdt("2025-01-02T06:00", "2025-01-01T17:00", Ok("1 day ago")),
  zdt("2025-01-03T01:00", "2025-01-01T23:00", Ok("2 days ago")),
  dur({ weeks: 3 }, Ok("3 weeks ago")),
  dur({ weeks: 3, days: 4 }, Ok("3 weeks ago")),
  dur({ weeks: 0, days: 11 }, Ok("1 week ago")),
  dur({ months: 1 }, Ok("1 month ago")),
  dur({ months: 2, weeks: 2, days: 2 }, Ok("2 months ago")),
  dur({ months: 1, weeks: 5, days: 2 }, Ok("2 months ago")),
  dur({ months: 1, days: 35 }, Ok("2 months ago")),
  dur({ years: 1 }, Ok("1 year ago")),
  dur({ years: 2 }, Ok("2 years ago")),
  dur({ months: 24 }, Ok("2 years ago")),
  dur({ years: 1, months: 13 }, Ok("2 years, 1 month ago")),
  dur({ years: 3, months: 7 }, Ok("3 years, 7 months ago")),
])("$message", ({ later, earlier, expected }) => {
  const timeAgoResult = timeAgoString(
    Temporal.ZonedDateTime.from(later),
    Temporal.ZonedDateTime.from(earlier),
  );
  // Workaround for the fact that Result.Err contains a stacktrace
  // so two instances are very unlikely to be equal even if their
  // payloads are equal
  if (expected.isErr()) {
    expect(timeAgoResult.isErr()).toBe(true);
    expect(timeAgoResult.unwrapErr()).toEqual(expected.error);
  } else {
    expect(timeAgoResult).toEqual(expected);
  }
});
