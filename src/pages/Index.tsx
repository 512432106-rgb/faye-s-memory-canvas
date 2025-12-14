import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DiarySection } from "@/components/diary/DiarySection";
import { InspirationSection } from "@/components/inspiration/InspirationSection";
import { TasksSection } from "@/components/tasks/TasksSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("diary");

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "diary":
        return <DiarySection />;
      case "inspiration":
        return <InspirationSection />;
      case "tasks":
        return <TasksSection />;
      default:
        return <DiarySection />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AppLayout>
  );
};

export default Index;
