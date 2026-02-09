export function validateId(id: string | undefined): number | null {
  if (!id) return null;
  const numId = Number(id);
  if (isNaN(numId) || !Number.isInteger(numId) || numId <= 0) return null;
  return numId;
}

export function validateRequestBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  return Object.keys(body as object).length > 0;
}
