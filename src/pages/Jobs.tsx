import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, ArrowRight, Code, Paintbrush, LineChart, Globe, Zap, Trophy, Target, FileText, Gavel, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { cn } from "@/utils/utils";

const Jobs: React.FC = () => {
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);
  const { getBestWpm } = useTestHistoryContext();
  const userWpm = getBestWpm();

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer (L5)",
      department: "Systems Engineering",
      location: "San Francisco / Remote",
      type: "Full-time",
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      description: "Building low-latency networking protocols. High typing precision required for mission-critical code.",
      tags: ["Rust", "Systems", "Performance"],
      minWpm: 80,
      priority: 'high'
    },
    {
      id: 2,
      title: "Medical Transcription Specialist",
      department: "Health Systems",
      location: "Remote (Global)",
      type: "Full-time",
      icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
      description: "Convert high-speed medical audio into clinical documentation with 99.9% accuracy.",
      tags: ["Clinical", "EMR", "Privacy"],
      minWpm: 100,
      priority: 'elite'
    },
    {
      id: 3,
      title: "Legal Stenographer",
      department: "Judiciary Services",
      location: "New York / Hub",
      type: "Contract",
      icon: <Gavel className="w-5 h-5 text-amber-400" />,
      description: "Official record keeping for high-profile courtroom proceedings. Requires extreme endurance.",
      tags: ["Law", "Official", "Endurance"],
      minWpm: 120,
      priority: 'elite'
    },
    {
      id: 4,
      title: "Technical Content Strategist",
      department: "Product Documentation",
      location: "Remote",
      type: "Full-time",
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      description: "Drafting deep-dive technical documentation for developer ecosystems.",
      tags: ["Documentation", "API", "Strategy"],
      minWpm: 60,
      priority: 'standard'
    }
  ];

  const calculateMatch = (minWpm: number) => {
    if (userWpm === 0) return 0;
    const ratio = userWpm / minWpm;
    if (ratio >= 1.2) return 100;
    if (ratio >= 1.0) return 90 + (ratio - 1.0) * 50;
    return Math.max(0, Math.floor(ratio * 100));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 selection:bg-primary/20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-12"
      >

        {/* Header */}
        <div className="text-center space-y-6 py-12 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="absolute top-0 right-[20%] hidden md:block"
          >
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-1 rotate-12 shadow-lg">
              Hiring Now!
            </Badge>
          </motion.div>

          <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full bg-primary/10 text-primary border-primary/20 animate-pulse">
            We're Hiring
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight">
            Join the <span className="text-primary underline decoration-wavy decoration-primary/30 underline-offset-8">Typing</span>OS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us build the world's most advanced typing ecosystem.
            We're a team of dreamers, builders, and fast typists.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Remote First", desc: "Work from anywhere. Output > Hours.", icon: Globe },
            { title: "Rapid Growth", desc: "Scale to millions. High impact work.", icon: Zap },
            { title: "Best Tools", desc: "Latest M3 MacBooks & Pro peripherals.", icon: Trophy }
          ].map((val, idx) => (
            <motion.div key={idx} variants={item}>
              <Card className="bg-muted/30 border-none hover:bg-muted/50 transition-colors cursor-default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <val.icon className="w-5 h-5 text-primary" /> {val.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {val.desc}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6" /> Open Positions
            </h2>
            <Button variant="ghost">View all</Button>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={item}
                onMouseEnter={() => setHoveredJob(job.id)}
                onMouseLeave={() => setHoveredJob(null)}
              >
                <Card className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-300 ${hoveredJob === job.id ? 'h-full' : 'h-0'}`} />

                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors relative">
                        {job.icon}
                        {hoveredJob === job.id && (
                          <motion.div
                            layoutId="sparkle"
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {/* Skill Match Badge - Innovative Feature */}
                            <div className={cn(
                              "flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold text-xs border",
                              calculateMatch(job.minWpm) >= 90
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            )}>
                              <Target className="w-3 h-3" /> {calculateMatch(job.minWpm)}% Match
                            </div>
                            {job.priority === 'elite' && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[9px] font-black uppercase tracking-widest">Elite Tier</Badge>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-1">
                          {job.description}
                        </p>
                        <div className="flex gap-2 pt-2">
                          {job.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50 group-hover:bg-secondary transition-colors">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="md:self-center">
                        <Button className="w-full md:w-auto gap-2 group-hover:translate-x-1 transition-transform bg-foreground text-background hover:bg-foreground/90 font-bold">
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div variants={item} className="text-center py-12 border-t mt-12 bg-muted/20 rounded-3xl p-8">
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Don't see the right role?</h3>
            <p className="text-muted-foreground">
              We're always looking for exceptional talent. If you think you can contribute to our mission, we want to hear from you.
            </p>
            <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/50 hover:bg-primary/5">
              Email Us Your Resume
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Jobs;
