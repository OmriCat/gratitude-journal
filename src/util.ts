export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function throwError(message: string): never;
export function throwError(error: Error): never;
export function throwError(errOrMessage: string | Error): never {
  if (typeof errOrMessage === "string") {
    throw new Error(errOrMessage);
  }
  throw errOrMessage;
}
