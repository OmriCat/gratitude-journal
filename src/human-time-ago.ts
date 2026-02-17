import { Temporal } from "temporal-polyfill";
import { Err, Ok, type Result } from "ts-results-es";

export function timeAgoString(
  later: Temporal.ZonedDateTime,
  earlier: Temporal.ZonedDateTime,
): Result<string, TimeAgoError> {
  const timeAgoResult = timeAgo(later, earlier);

  if (timeAgoResult.isErr()) {
    return timeAgoResult;
  }
  const { value } = timeAgoResult;

  switch (value.kind) {
    case TimeAgoKind.Minutes:
      if (value.minutes < 1) return Ok("Just now");
      return Ok(`${pluralUnits("minute", value.minutes)} ago`);
    case TimeAgoKind.Hours:
      return Ok(`${pluralUnits("hour", value.hours)} ago`);
    case TimeAgoKind.Days:
      return Ok(`${pluralUnits("day", value.days)} ago`);
    case TimeAgoKind.Weeks:
      return Ok(`${pluralUnits("week", value.weeks)} ago`);
    case TimeAgoKind.Months:
      return Ok(`${pluralUnits("month", value.months)} ago`);
    case TimeAgoKind.YearsAndMonths: {
      const { months, years } = value;
      // Can assume years are at least 1
      const yearString = pluralUnits("year", years);
      const monthString = months > 0 ? `, ${pluralUnits("month", months)}` : "";
      return Ok(`${yearString}${monthString} ago`);
    }
  }
}

function pluralUnits(unit: string, value: number): string {
  if (value > 1) return `${value} ${unit}s`;
  return `1 ${unit}`;
}

export enum TimeAgoKind {
  YearsAndMonths = 0,
  Months = 1,
  Weeks = 2,
  Days = 3,
  Hours = 4,
  Minutes = 5,
}

export type TimeAgo =
  | {
      kind: TimeAgoKind.YearsAndMonths;
      years: number;
      months: number;
    }
  | {
      kind: TimeAgoKind.Months;
      months: number;
    }
  | {
      kind: TimeAgoKind.Weeks;
      weeks: number;
    }
  | {
      kind: TimeAgoKind.Days;
      days: number;
    }
  | {
      kind: TimeAgoKind.Hours;
      hours: number;
    }
  | {
      kind: TimeAgoKind.Minutes;
      minutes: number;
    };

export enum TimeAgoError {
  LaterBeforeEarlier = "laterBeforeEarlier",
  NotSupported = "notSupported",
}

export function timeAgo(
  later: Temporal.ZonedDateTime,
  earlier: Temporal.ZonedDateTime,
): Result<TimeAgo, TimeAgoError> {
  if (Temporal.ZonedDateTime.compare(later, earlier) < 0) {
    return Err(TimeAgoError.LaterBeforeEarlier);
  }

  function roundToUnit(
    units: {
      largestUnit: Temporal.DateTimeUnit;
      smallestUnit?: Temporal.DateTimeUnit;
    },
    compareTo: Temporal.DurationLike,
    ifMatches: (rounded: Temporal.Duration) => TimeAgo,
    computeDuration: (
      later: Temporal.ZonedDateTime,
      earlier: Temporal.ZonedDateTime,
    ) => Temporal.Duration = (later, earlier) => {
      return later.since(earlier);
    },
  ): (
    later: Temporal.ZonedDateTime,
    earlier: Temporal.ZonedDateTime,
  ) => TimeAgo | null {
    return (later: Temporal.ZonedDateTime, earlier: Temporal.ZonedDateTime) => {
      const roundingUnits: Temporal.DurationRoundTo = {
        smallestUnit: units.smallestUnit ?? units.largestUnit,
        largestUnit: units.largestUnit,
        roundingMode: "trunc",
      };

      // Only include relativeTo in rounding options when we're rounding to a calendar unit
      const roundingOptions: Temporal.DurationRoundTo =
        units.largestUnit === "year" ||
        units.largestUnit === "month" ||
        units.largestUnit === "week"
          ? {
              ...roundingUnits,
              relativeTo: later,
            }
          : roundingUnits;

      const duration = computeDuration(later, earlier);
      const rounded = duration.round(roundingOptions);
      return Temporal.Duration.compare(rounded, compareTo, {
        relativeTo: later,
      }) >= 0
        ? ifMatches(rounded)
        : null;
    };
  }

  // These should be in decreasing order of compareTo, since we want to use the first that matches
  const roundings = [
    roundToUnit(
      { largestUnit: "year", smallestUnit: "month" },
      { years: 1 },
      ({ years, months }) => ({
        kind: TimeAgoKind.YearsAndMonths,
        years,
        months,
      }),
    ),
    roundToUnit({ largestUnit: "month" }, { months: 1 }, ({ months }) => ({
      kind: TimeAgoKind.Months,
      months,
    })),
    roundToUnit({ largestUnit: "week" }, { weeks: 1 }, ({ weeks }) => ({
      kind: TimeAgoKind.Weeks,
      weeks,
    })),
    roundToUnit(
      { largestUnit: "day" },
      { days: 1 },
      ({ days }) => ({
        kind: TimeAgoKind.Days,
        days,
      }),
      (later, earlier) => later.toPlainDate().since(earlier.toPlainDate()),
    ),
    roundToUnit({ largestUnit: "hour" }, { hours: 1 }, ({ hours }) => ({
      kind: TimeAgoKind.Hours,
      hours,
    })),
    roundToUnit(
      { largestUnit: "minute", smallestUnit: "second" },
      { seconds: 0 },
      ({ minutes }) => ({
        kind: TimeAgoKind.Minutes,
        minutes,
      }),
    ),
  ];

  for (const f of roundings) {
    const timeAgo = f(later, earlier);
    if (timeAgo !== null) {
      return Ok(timeAgo);
    }
  }

  // If we've reached here, we haven't matched any of the above functions so the caller
  // is apparently trying to do something not supported
  return Err(TimeAgoError.NotSupported);
}
