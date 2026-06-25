/** Tiny classnames joiner — no dependency, no merge magic. Keep usage tidy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
