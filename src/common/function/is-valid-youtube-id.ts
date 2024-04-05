export function isValidYoutubeId(id: string) {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}
