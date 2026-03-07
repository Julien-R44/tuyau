/**
 * Converts a camelCase string to snake_case.
 * Used to transform proxy property names (e.g. `getArticles`)
 * into AdonisJS route name segments (e.g. `get_articles`)
 */
export function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

/**
 * Joins an array of camelCase segments into a dot-separated
 * snake_case route name that matches AdonisJS conventions.
 * e.g. `['users', 'getProfile']` → `'users.get_profile'`
 */
export function segmentsToRouteName(segments: string[]): string {
  return segments.map(toSnakeCase).join('.')
}
