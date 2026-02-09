export function camelToSnake(str: string): string {
  if (str.includes("_")) return str;
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function objectToSnakeCase<T extends Record<string, unknown>>(obj: T): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((item) => objectToSnakeCase(item as Record<string, unknown>));
  if (typeof obj !== "object" || obj instanceof Date) {
    if (obj instanceof Date) return obj.toISOString();
    if (typeof obj === "bigint") return Number(obj);
    return obj;
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    if (value !== null && typeof value === "object" && !(value instanceof Date)) {
      if (Array.isArray(value)) {
        result[snakeKey] = value.map((item) => objectToSnakeCase(item as Record<string, unknown>));
      } else {
        result[snakeKey] = objectToSnakeCase(value as Record<string, unknown>);
      }
    } else if (value instanceof Date) {
      result[snakeKey] = value.toISOString();
    } else if (typeof value === "bigint") {
      result[snakeKey] = Number(value);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}
