import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="relative w-9 h-9 rounded-full border border-line bg-soft text-ink flex items-center justify-center hover:border-accent/50 hover:text-accent-ink transition-colors"
      data-testid="theme-toggle"
    >
      <Sun size={16} className={`absolute transition-all duration-300 ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
      <Moon size={16} className={`absolute transition-all duration-300 ${dark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`} />
    </button>
  );
}
