import React, { useState, useEffect } from 'react';
import { TypingTestBox } from '@/components/typing/TypingTestBox';
import {
  PremiumBannerWidget,
  DashboardLinksWidget
} from '@/components/shared/HomeWidgets';

import { TypingConfigBar } from '@/components/typing/TypingConfigBar';
import { AdPlacement } from '@/components/shared/AdPlacement';
import { useTestHistoryContext } from '@/contexts/TestHistoryContext';
import { useUniversePulse } from '@/contexts/UniversePulseContext';
import { useGamification } from '@/contexts/GamificationContext';

import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Activity, Sparkles, TrendingUp, Target, BarChart3, ChevronRight, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

const HomeDashboard: React.FC = () => {
  const { t } = useTranslation();
  const history = useTestHistoryContext();
  const { events } = useUniversePulse();
  const { userStats } = useGamification();
  const [globalRank, setGlobalRank] = useState<string>('---');

  const averageWpm = history.getAverageWpm();
  const topWpm = history.getBestWpm();
  const avgAccuracy = history.getAverageAccuracy();
  const totalTests = history.results.length;

  // Career Readiness Logic
  const careerReadiness = Math.min(100, Math.round((averageWpm / 60) * 50 + (avgAccuracy / 100) * 50));
  const qualificationProb = Math.min(100, Math.round((topWpm / 80) * 60 + (avgAccuracy / 100) * 40));

  useEffect(() => {
    // Global rank fetch removed for loginless architecture
    // We can show a local rank or keep it at ---
    if (averageWpm > 0) {
      setGlobalRank(`#${Math.floor(1000 - (averageWpm * 5))} (EST)`);
    }
  }, [averageWpm]);

  return (
    <div className="min-h-screen bg-[#0F1113] selection:bg-primary/30 selection:text-primary-foreground">
      {/* LIVE UNIVERSE PULSE (Global Social Proof) */}
      <div className="w-full bg-primary/10 border-b border-primary/20 py-1.5 overflow-hidden whitespace-nowrap z-30 relative">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center text-[10px] font-black uppercase tracking-tighter text-primary/70"
        >
          {events.map((event) => (
            <div key={event.id} className="flex gap-16 items-center">
              <span className="flex items-center gap-2">
                {event.type === 'achievement' && <Trophy className="w-3 h-3 text-amber-500" />}
                {event.type === 'social' && <Users className="w-3 h-3 text-blue-500" />}
                {event.type === 'system' && <Activity className="w-3 h-3 text-green-500" />}
                {event.message}
              </span>
            </div>
          ))}
          {/* Double for continuous scroll effect */}
          {events.map((event) => (
            <div key={`${event.id}-double`} className="flex gap-16 items-center">
              <span className="flex items-center gap-2">
                {event.type === 'achievement' && <Trophy className="w-3 h-3 text-amber-500" />}
                {event.type === 'social' && <Users className="w-3 h-3 text-blue-500" />}
                {event.type === 'system' && <Activity className="w-3 h-3 text-green-500" />}
                {event.message}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-2 space-y-4">
        {/* TOP HEADER ADVERTISEMENT */}
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-1000">
          <AdPlacement type="horizontal" className="bg-primary/5 border-primary/10" />
        </div>

        {/* CONFIG BAR */}
        <div className="relative z-20">
          <TypingConfigBar />
        </div>

        {/* CENTRAL TYPING AREA */}
        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-100">
          <TypingTestBox />
        </div>

        {/* CAREER INTELLIGENCE (AI Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Card className="bg-secondary/10 border-white/5 hover:border-primary/20 transition-all cursor-crosshair group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-16 h-16 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                {t('AI Predicted WPM')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black italic">{averageWpm ? (averageWpm * 1.12).toFixed(1) : '---'}</div>
              <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold text-green-500">{t('+12% Potency with AI Optmization')}</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-white/5 hover:border-primary/20 transition-all cursor-crosshair group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-16 h-16 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                {t('Qualification Probability')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black italic text-primary">92%</div>
              <Progress value={92} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-white/5 hover:border-primary/20 transition-all cursor-crosshair group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3 text-blue-500" />
                {t('Peak Performance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black italic">{topWpm || '---'} <span className="text-xs">WPM</span></div>
              <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold italic">{t('Top 4% Global Percentile')}</p>
            </CardContent>
          </Card>
        </div>

        {/* QUICK ACCESS LINKS */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-250">
          <DashboardLinksWidget />
        </div>

        {/* ENTERPRISE SPONSORED AD (Refactored) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-1000 delay-300">
          <div className="bg-secondary/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase">{t('Elite Creator Toolkit')}</h5>
                <p className="text-[8px] text-muted-foreground uppercase">{t('Everything to start your typing channel')}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-[9px] font-black uppercase group-hover:text-primary">Sponsored <ChevronRight className="w-3 h-3 ml-1" /></Button>
          </div>
          <div className="bg-secondary/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group text-right flex-row-reverse">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase text-blue-500">{t('Universal Championship')}</h5>
                <p className="text-[8px] text-muted-foreground uppercase">{t('Register for Season 3 Openings')}</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-[9px] font-black uppercase group-hover:text-blue-500">Sponsored <ChevronRight className="w-3 h-3 mr-1 rotate-180" /></Button>
          </div>
        </div>

        {/* PREMIUM BANNER FOOTER */}
        <div className="animate-in fade-in duration-1000 delay-300">
          <PremiumBannerWidget />
        </div>
      </div>

      {/* Decorative gradients */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>
    </div>
  );
};

export default HomeDashboard;
