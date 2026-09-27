import React from "react";
import { AnalyticsDashboard } from "@/components/b2b/AnalyticsDashboard";
import { StudentRoster } from "@/components/b2b/StudentRoster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, GraduationCap, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SchoolDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-500" />
                TypingOS for Education
              </h1>
              <p className="text-xs text-muted-foreground">Springfield High School • Admin View</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Invite Teachers
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-secondary/20 p-1 border border-white/5">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4" />
              Curriculum
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsDashboard type="school" />
          </TabsContent>

          <TabsContent value="students">
            <StudentRoster type="school" />
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/20 rounded-xl bg-secondary/5">
              <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Curriculum Management</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Assign lessons, create custom tests, and manage learning paths for your classes.
              </p>
              <Button>Create Lesson Plan</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
