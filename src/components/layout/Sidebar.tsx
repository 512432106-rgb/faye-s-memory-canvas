import { LayoutDashboard, Book, Lightbulb, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "diary", label: "Diary", icon: Book },
  { id: "inspiration", label: "Inspiration", icon: Lightbulb },
  { id: "tasks", label: "Daily Tasks", icon: CheckSquare },
];

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 mb-6">
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Book className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">Faye's Diary</h1>
          <p className="text-xs text-muted-foreground">Keep it cozy</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "nav-item w-full text-left",
              activeSection === item.id
                ? "active"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="size-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="space-y-2 mt-auto">
        <button className="nav-item w-full text-left text-muted-foreground hover:text-foreground">
          <Settings className="size-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
