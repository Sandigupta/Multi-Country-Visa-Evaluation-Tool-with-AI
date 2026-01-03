import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
        return "dark"; // Default to dark per mockup? Mockup shows dark.
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Read system pref or localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                "bg-secondary/50 backdrop-blur-sm"
            )}
        >
            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === "light" ? "Light mode" : "Dark mode"}</span>
        </button>
    );
}
