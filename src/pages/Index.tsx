import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DiarySection } from "@/components/diary/DiarySection";
import { InspirationSection } from "@/components/inspiration/InspirationSection";
import { TasksSection } from "@/components/tasks/TasksSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "diary":
        return <DiarySection />;
      case "inspiration":
        return <InspirationSection />;
      case "tasks":
        return <TasksSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AppLayout>
  );
};

export default Index;
