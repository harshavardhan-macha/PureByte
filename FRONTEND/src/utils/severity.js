/**
 * Derive an effective severity label for an ingredient.
 * Returns ingredient.severity_level when present and non-empty,
 * otherwise falls back to a mapping from nova_group.
 *
 * Labels returned are lowercase: "low", "medium", "high", "severe", or "unknown".
 */
export function getEffectiveSeverity(ingredient) {
  if (!ingredient || typeof ingredient !== "object") return "unknown";

  // Prefer explicit severity fields if present.
  const sev = ingredient.severity_level ?? ingredient.severity ?? null;
  if (sev !== null && sev !== undefined) {
    const s = String(sev).trim();
    if (s !== "") return s.toLowerCase();
  }

  // Fallback to nova_group mapping
  const ng = ingredient.nova_group;
  if (ng === null || ng === undefined || ng === "") return "unknown";

  const n = Number(ng);
  if (Number.isNaN(n)) return "unknown";

  if (n === 0 || n === 1) return "low";
  if (n === 2) return "medium";
  if (n === 3) return "high";
  if (n === 4) return "severe";

  return "unknown";
}

export default getEffectiveSeverity;
