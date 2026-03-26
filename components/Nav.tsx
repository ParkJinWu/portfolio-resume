import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  "About",
  "Experience",
  "Skills",
  "Projects",
  "Education",
  "Contact",
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest uppercase text-foreground">
          Portfolio
        </span>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs text-muted hover:text-foreground transition-colors font-mono uppercase tracking-wider"
              >
                {item}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
