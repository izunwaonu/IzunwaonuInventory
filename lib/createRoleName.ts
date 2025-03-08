export function createRoleName(displayName: string): string {
  return displayName.toLowerCase().replace(/\s+/g, "_");
}
