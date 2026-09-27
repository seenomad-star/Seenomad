
import { motion } from "framer-motion";
import { Globe, BookOpen, Clock, Activity, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/utils";

interface CountryCardProps {
    country: string;
    flag: string;
    examCount: number;
    region: string;
    popularExams: string[];
    totalPosts: number;
    onClick: () => void;
    className?: string;
}

export const CountryCard = ({
    country,
    flag,
    examCount,
    region,
    popularExams,
    totalPosts,
    onClick,
    className
}: CountryCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn("h-full cursor-pointer", className)}
            onClick={onClick}
        >
            <Card className="h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">

                {/* Flag Header Background */}
                <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
                    <div className="absolute -right-4 -top-6 text-[8rem] opacity-[0.07] grayscale pointer-events-none select-none">
                        {flag}
                    </div>
                    <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-primary/20 shadow-sm gap-1">
                            <Globe className="w-3 h-3 text-primary" />
                            <span className="capitalize">{region}</span>
                        </Badge>
                    </div>
                </div>

                <div className="p-6 pt-0 relative">
                    {/* Country Avatar/Flag */}
                    <div className="w-16 h-16 rounded-2xl bg-card border-4 border-card shadow-xl flex items-center justify-center text-4xl -mt-8 mb-4 group-hover:scale-110 transition-transform duration-300">
                        {flag}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 group-hover:to-primary transition-all">
                                {country}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                <span className="font-medium text-primary">{examCount}</span> Exams Available
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/40">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                                    <Activity className="w-3 h-3" /> Practice
                                </span>
                                <span className="text-sm font-semibold">Ready</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                                    <Users className="w-3 h-3" /> Roles
                                </span>
                                <span className="text-sm font-semibold">{totalPosts}+</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                <Award className="w-3 h-3 text-primary" /> Top Exams
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {popularExams.slice(0, 3).map((exam, i) => (
                                    <Badge key={i} variant="outline" className="bg-primary/5 border-primary/10 text-xs font-normal">
                                        {exam}
                                    </Badge>
                                ))}
                                {popularExams.length > 3 && (
                                    <Badge variant="outline" className="text-xs font-normal opacity-70">
                                        +{popularExams.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
