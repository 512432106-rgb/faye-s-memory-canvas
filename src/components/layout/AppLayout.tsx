import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AppLayout = ({ children, activeSection, onSectionChange }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
