import { Temporal } from "temporal-polyfill";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { TimeAgoError, timeAgoString } from "@/human-time-ago.ts";
import { expect, test } from "vitest";

const FIXED_DATE = Temporal.ZonedDateTime.from("2025-01-01T12:00[UTC]");

type TestCase = {
  later: Temporal.ZonedDateTime;
  earlier: Temporal.ZonedDateTime;
  expected: Result<String, TimeAgoError>;
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
  // zdt("2025-01-02T06:00", "2025-01-01T17:00", Ok({ days: 1 })),
  // zdt("2025-01-03T01:00", "2025-01-01T23:00", Ok({ days: 2 })),
  // dur({ weeks: 3 }, Ok({ weeks: 3 })),
  // dur({ weeks: 3, days: 4 }, Ok({ weeks: 3 })),
  // dur({ weeks: 0, days: 11 }, Ok({ weeks: 1 })),
  // dur({ months: 2, weeks: 2, days: 2 }, Ok({ months: 2 })),
  // dur({ months: 1, weeks: 5, days: 2 }, Ok({ months: 2 })),
  // dur({ months: 1, days: 35 }, Ok({ months: 2 })),
  // dur({ years: 2 }, Ok({ years: 2, months: 0 })),
  // dur({ years: 1 }, Ok({ years: 1, months: 0 })),
  // dur({ months: 24 }, Ok({ years: 2, months: 0 })),
  // dur({ years: 1, months: 13 }, Ok({ years: 2, months: 1 })),
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
