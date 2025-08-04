import { useState } from "react";
import { CheckSquare, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistView } from "@/components/checklist/ChecklistView";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [selectedChecklist, setSelectedChecklist] = useState<{ id: string; title: string } | null>(null);

  const handleChecklistSelect = (id: string, title: string) => {
    setSelectedChecklist({ id, title });
  };

  const handleBackToDashboard = () => {
    setSelectedChecklist(null);
  };

  if (selectedChecklist) {
    return (
      <ChecklistView
        checklistId={selectedChecklist.id}
        checklistTitle={selectedChecklist.title}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Checklist</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Checklists</h1>
          <p className="text-muted-foreground">
            Organize your tasks and stay productive
          </p>
        </div>

        {/* Create New Checklist Card */}
        <div className="grid gap-6">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create New Checklist</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Start organizing your tasks with a new checklist. Perfect for trips, projects, or daily routines.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Checklist
              </Button>
            </CardContent>
          </Card>

          {/* Sample Checklist Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleChecklistSelect("vacation", "Vacation Preparation")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Vacation Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>7 open tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>9 completed</span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '56%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Updated 2 hours ago</p>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleChecklistSelect("groceries", "Weekly Groceries")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Weekly Groceries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>3 open tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>12 completed</span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Updated 1 day ago</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}