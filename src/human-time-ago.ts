import {Temporal} from "temporal-polyfill";
import {Err, Ok, type Result} from "ts-results-es";

export type TimeAgo =
    | {
    years: number;
    months: number;
}
    | {
    months: number;
}
    | {
    weeks: number;
}
    | {
    days: number;
}
    | {
    hours: number;
}
    | {
    minutes: number;
}
    | "just now";

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
            const roundingOptions: Temporal.DurationRoundTo = {
                smallestUnit: units.smallestUnit ?? units.largestUnit,
                largestUnit: units.largestUnit,
                roundingMode: "trunc",
                relativeTo: later,
            };

            const rounded = computeDuration(later, earlier).round(roundingOptions);
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
            {largestUnit: "year", smallestUnit: "month"},
            {years: 1},
            ({years, months}) => ({
                years,
                months,
            }),
        ),
        roundToUnit({largestUnit: "month"}, {months: 1}, ({months}) => ({
            months,
        })),
        roundToUnit({largestUnit: "week"}, {weeks: 1}, ({weeks}) => ({
            weeks,
        })),
        roundToUnit(
            {largestUnit: "day"},
            {days: 1},
            ({days}) => ({days}),
            (later, earlier) => later.toPlainDate().since(earlier.toPlainDate()),
        ),
        roundToUnit({largestUnit: "hour"}, {hours: 1}, ({hours}) => ({
            hours,
        })),
        roundToUnit(
            {largestUnit: "minute", smallestUnit: "second"},
            {seconds: 0},
            ({minutes}) => ({
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

