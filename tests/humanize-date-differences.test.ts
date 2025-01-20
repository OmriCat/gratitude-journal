import { expect, test } from "vitest";
import { Temporal } from "temporal-polyfill";
import {
  timeAgo,
  type TimeAgo,
  TimeAgoError,
  TimeAgoKind,
} from "@/human-time-ago";
import { Err, Ok, type Result } from "ts-results-es";

const FIXED_DATE = Temporal.ZonedDateTime.from("2025-01-01T12:00[UTC]");

type TestCase = {
  later: Temporal.ZonedDateTime;
  earlier: Temporal.ZonedDateTime;
  expected: Result<TimeAgo, TimeAgoError>;
  message: string;
};

function dur(
  duration: Temporal.DurationLike,
  expected: Result<TimeAgo, TimeAgoError>,
): TestCase {
  return zdt(FIXED_DATE, FIXED_DATE.subtract(duration), expected);
}

function zdt(
  later: Temporal.ZonedDateTimeLike | string,
  earlier: Temporal.ZonedDateTimeLike | string,
  expected: Result<TimeAgo, TimeAgoError>,
): TestCase {
  const toString = (obj: TimeAgo | TimeAgoError) =>
    "{" +
    Object.entries(obj)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ") +
    "}";
  const expectedMessage = expected.isOk()
    ? toString(expected.value)
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
  dur({ seconds: 30 }, Ok({ minutes: 0, kind: TimeAgoKind.Minutes })),
  dur({ seconds: 61 }, Ok({ minutes: 1, kind: TimeAgoKind.Minutes })),
  dur({ minutes: 30 }, Ok({ minutes: 30, kind: TimeAgoKind.Minutes })),
  dur({ minutes: 365 }, Ok({ hours: 6, kind: TimeAgoKind.Hours })),
  zdt(
    "2025-01-01T06:00",
    "2025-01-01T04:00",
    Ok({ hours: 2, kind: TimeAgoKind.Hours }),
  ),
  zdt(
    "2025-01-02T06:00",
    "2025-01-01T17:00",
    Ok({ days: 1, kind: TimeAgoKind.Days }),
  ),
  zdt(
    "2025-01-03T01:00",
    "2025-01-01T23:00",
    Ok({ days: 2, kind: TimeAgoKind.Days }),
  ),
  dur({ weeks: 3 }, Ok({ weeks: 3, kind: TimeAgoKind.Weeks })),
  dur({ weeks: 3, days: 4 }, Ok({ weeks: 3, kind: TimeAgoKind.Weeks })),
  dur({ weeks: 0, days: 11 }, Ok({ weeks: 1, kind: TimeAgoKind.Weeks })),
  dur(
    { months: 2, weeks: 2, days: 2 },
    Ok({ months: 2, kind: TimeAgoKind.Months }),
  ),
  dur(
    { months: 1, weeks: 5, days: 2 },
    Ok({ months: 2, kind: TimeAgoKind.Months }),
  ),
  dur({ months: 1, days: 35 }, Ok({ months: 2, kind: TimeAgoKind.Months })),
  dur(
    { years: 2 },
    Ok({ years: 2, months: 0, kind: TimeAgoKind.YearsAndMonths }),
  ),
  dur(
    { years: 1 },
    Ok({ years: 1, months: 0, kind: TimeAgoKind.YearsAndMonths }),
  ),
  dur(
    { months: 24 },
    Ok({ years: 2, months: 0, kind: TimeAgoKind.YearsAndMonths }),
  ),
  dur(
    { years: 1, months: 13 },
    Ok({ years: 2, months: 1, kind: TimeAgoKind.YearsAndMonths }),
  ),
])("$message", ({ later, earlier, expected }) => {
  const timeAgoResult = timeAgo(
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
