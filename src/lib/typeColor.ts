/**
 * Project type labels store a "-400" text color in portfolio.json, which is too
 * faint on the light theme. This maps each to a darker shade for light mode while
 * keeping the original in dark mode. (Full class names so Tailwind generates them.)
 */
const MAP: Record<string, string> = {
  "text-blue-400": "text-blue-700 dark:text-blue-400",
  "text-green-400": "text-green-700 dark:text-green-400",
  "text-orange-400": "text-orange-700 dark:text-orange-400",
  "text-pink-400": "text-pink-700 dark:text-pink-400",
  "text-purple-400": "text-purple-700 dark:text-purple-400",
  "text-red-400": "text-red-700 dark:text-red-400",
  "text-yellow-400": "text-yellow-700 dark:text-yellow-400",
};

export const typeColor = (cls: string) => MAP[cls] ?? cls;
