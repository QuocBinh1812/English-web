/**
 * Static topic → icon lookup for rendering covers without waiting for the
 * facets request. Topic names/counts still come from the API.
 * Keep in sync with seed topics (and the `topics` table later).
 */
export const TOPIC_ICON_BY_SLUG: Record<string, string> = {
  "daily-life": "coffee",
  travel: "plane",
  work: "briefcase",
  technology: "cpu",
  science: "flask",
  health: "heart",
  culture: "landmark",
  news: "newspaper",
  stories: "book",
  music: "music",
  food: "utensils",
  environment: "leaf",
  pronunciation: "audio",
};
