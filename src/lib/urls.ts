export function isValidUrl(url?: string) {
  return Boolean(url && url.trim() !== "" && url !== "#");
}
