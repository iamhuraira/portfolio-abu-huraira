export function isValidUrl(url?: string) {
  return Boolean(url && url.trim() !== "" && url !== "#");
}

export function assetUrl(path: string) {
  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}
