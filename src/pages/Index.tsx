import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DiarySection } from "@/components/diary/DiarySection";
import { InspirationSection } from "@/components/inspiration/InspirationSection";
import { TasksSection } from "@/components/tasks/TasksSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderSection()}
    </AppLayout>
  );
};

export default Index;
