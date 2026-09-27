import React from "react";
import { AnalyticsDashboard } from "@/components/b2b/AnalyticsDashboard";
import { StudentRoster } from "@/components/b2b/StudentRoster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, Building2, CreditCard, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BusinessDashboard() {
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
                <Building2 className="w-6 h-6 text-emerald-500" />
                TypingOS Enterprise
              </h1>
              <p className="text-xs text-muted-foreground">Acme Corp • HR Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Manage Plan
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Add Seats
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="insights" className="space-y-8">
          <TabsList className="bg-secondary/20 p-1 border border-white/5">
            <TabsTrigger value="insights" className="gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Team Roster
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <AnalyticsDashboard type="business" />
          </TabsContent>

          <TabsContent value="team">
            <StudentRoster type="business" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
