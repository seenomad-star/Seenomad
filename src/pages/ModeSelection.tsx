import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode, UserMode, UserRole } from '@/contexts/UserModeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Building2, 
  Home, 
  User, 
  Users, 
  BookOpen, 
  Trophy,
  Target,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const modes: { 
  id: UserMode; 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  color: string;
  features: string[];
  roles: { id: UserRole; name: string }[];
}[] = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'Personal typing practice with progress tracking and achievements',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    features: ['Personal dashboard', 'Achievement system', 'Skill progression', 'Practice modes'],
    roles: [{ id: 'individual', name: 'Individual User' }],
  },
  {
    id: 'school',
    title: 'School / Classroom',
    description: 'Complete classroom management with teacher tools and student tracking',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-500',
    features: ['Class management', 'Assignment creation', 'Progress reports', 'Student analytics'],
    roles: [
      { id: 'teacher', name: 'Teacher' },
      { id: 'student', name: 'Student' },
      { id: 'admin', name: 'School Admin' },
    ],
  },
  {
    id: 'business',
    title: 'Business / Enterprise',
    description: 'Team productivity tools with performance tracking and challenges',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    features: ['Team management', 'Performance metrics', 'Skill benchmarks', 'Company challenges'],
    roles: [
      { id: 'manager', name: 'Manager' },
      { id: 'employee', name: 'Employee' },
      { id: 'admin', name: 'Admin' },
    ],
  },
  {
    id: 'home',
    title: 'Home / Family',
    description: 'Family-friendly learning with parental controls and fun activities',
    icon: Home,
    color: 'from-orange-500 to-amber-500',
    features: ['Family profiles', 'Parental controls', 'Kid-friendly games', 'Progress rewards'],
    roles: [
      { id: 'parent', name: 'Parent' },
      { id: 'child', name: 'Child' },
    ],
  },
];

const ModeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setMode, setRole } = useUserMode();

  const handleSelectMode = (mode: UserMode, role: UserRole) => {
    setMode(mode);
    setRole(role);
    
    switch (mode) {
      case 'school':
        navigate('/school-dashboard');
        break;
      case 'business':
        navigate('/business-dashboard');
        break;
      case 'home':
        navigate('/home-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Choose Your Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-primary">TypeMaster</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the mode that best fits your needs. Each mode offers specialized features and tools.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {modes.map((mode) => (
            <Card 
              key={mode.id}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color} text-white`}>
                    <mode.icon className="w-8 h-8" />
                  </div>
                  {mode.id === 'school' && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Most Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mt-4">{mode.title}</CardTitle>
                <CardDescription className="text-base">{mode.description}</CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {mode.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mode.color}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Select your role:</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.roles.map((role) => (
                      <Button
                        key={role.id}
                        variant="outline"
                        className="group/btn hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSelectMode(mode.id, role.id)}
                      >
                        {role.name}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">10K+</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">500+</p>
            <p className="text-sm text-muted-foreground">Schools</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">1M+</p>
            <p className="text-sm text-muted-foreground">Tests Completed</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
            <Target className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-sm text-muted-foreground">Avg Improvement</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
