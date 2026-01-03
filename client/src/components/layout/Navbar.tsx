import { Link } from "react-router-dom";
import { Globe, Users } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 h-16 max-w-5xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-foreground font-bold text-xl tracking-tight">
                    <Globe className="h-6 w-6 text-primary" />
                    <span>OPEN SPHERE</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/partners" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                        <Users className="h-4 w-4" />
                        <span>Partners</span>
                    </Link>

                    <div className="hidden md:block px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Visa Intelligence
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
