export function getInitials(...parts: Array<string | null | undefined>): string {
  const words = parts
    .flatMap((part) => (part ?? '').trim().split(/[\s._-]+/))
    .filter(Boolean);

  if (words.length === 0) return '?';
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0]}${words[words.length - 1]![0]}`.toUpperCase();
}
