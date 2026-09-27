import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { ThemeProvider } from "next-themes";
import { OSLayout } from "@/components/layout/OSLayout";
import { ExamProvider } from "@/contexts/ExamContext";
import { TestHistoryProvider } from "@/contexts/TestHistoryContext";
import { CustomTextProvider } from "@/contexts/CustomTextContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { UserModeProvider } from "@/contexts/UserModeContext";
import { UniversePulseProvider } from "@/contexts/UniversePulseContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { FocusWorkspaceProvider } from "@/contexts/FocusWorkspaceContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "@/pages/HomeDashboard";
import Lessons from "@/pages/Lessons";
import Courses from "@/pages/Courses";
const Games = lazy(() => import("@/pages/Games"));
const Statistics = lazy(() => import("@/pages/Statistics"));
import Achievements from "@/pages/Achievements";
import Exams from "@/pages/Exams";
const Settings = lazy(() => import("@/pages/Settings"));
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/NotFound";
import GlobalExams from "@/pages/GlobalExams";
import ProgressiveLessons from "@/pages/ProgressiveLessons";
import AIAcademy from "@/pages/AIAcademy";
import Earn from "@/pages/Earn";
import Tournaments from "@/pages/Tournaments";
import Community from "@/pages/Community";
import CertificateVerify from "@/pages/CertificateVerify";
import NumberSymbolPractice from "@/pages/NumberSymbolPractice";
import Marketplace from "@/pages/Marketplace";
import MissionMarketplace from "@/pages/MissionMarketplace";
import Clans from "@/pages/Clans";
import ClanWarZone from "@/pages/ClanWarZone";
import SeasonPass from "@/pages/SeasonPass";
import GlobalLeaderboards from "@/pages/GlobalLeaderboards";
import BookLibrary from "@/pages/BookLibrary";
import BookReader from "@/pages/BookReader";
import DeveloperPortal from "@/pages/DeveloperPortal";
import WordCrush from "@/pages/WordCrush";
import SkillProgression from "@/pages/SkillProgression";
import ModeSelection from "@/pages/ModeSelection";
import MultiplayerRace from "@/pages/MultiplayerRace";
import SchoolDashboard from "@/pages/SchoolDashboard";
import BusinessDashboard from "@/pages/BusinessDashboard";
// Removed redundant HomeDashboard import
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Jobs from "@/pages/Jobs";
import Download from "@/pages/Download";
import FAQ from "@/pages/FAQ";
import UserGuides from "@/pages/UserGuides";
import WhatsNew from "@/pages/WhatsNew";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Brand from "@/pages/Brand";
import Security from "@/pages/Security";
import Accessibility from "@/pages/Accessibility";
import { ReferralSystem } from "@/pages/ReferralSystem";
import { TypingGame } from "@/pages/TypingGame";
import Zen from "@/pages/Zen";
import CustomPractice from "@/pages/CustomPractice";
import BlogCommentsPage from "@/pages/BlogCommentsPage";
import AICoachPage from "@/pages/AICoachPage";
import NeonKnight from "@/components/games/NeonKnight";
import HeistMaster from "@/components/games/HeistMaster";
import BossBattleMode from "@/components/games/BossBattleMode";
import CosmeticsShop from "@/pages/CosmeticsShop";
import { PricingPage } from "@/pages/PricingPage";
import { TypeDungeon } from "@/components/games/TypeDungeon";
// import OSBootLogin from "@/pages/OSBootLogin";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { DailyRewardModal } from "@/components/shared/DailyRewardModal";
import ExamMissionControl from "@/pages/ExamMissionControl";
import ForgeEditor from "@/components/forge/ForgeEditor";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import TypingSpeedTestPage from "@/pages/TypingSpeedTestPage";
import TypingPracticePage from "@/pages/TypingPracticePage";
import WpmCalculatorPage from "@/pages/WpmCalculatorPage";
// import ResetPassword from "@/pages/ResetPassword";

import { SEOHead } from "@/components/seo/SEOHead";
import { EconomyProvider } from "@/contexts/EconomyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

const queryClient = new QueryClient();

// Dynamic basename: works for both typingos.com (/) and github.io/typingos (/typingos)
console.log("App initializing... hostname:", typeof window !== 'undefined' ? window.location.hostname : 'ssr');
console.log("App initializing... pathname:", typeof window !== 'undefined' ? window.location.pathname : 'ssr');

const basename = typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/typingos'))
  ? '/typingos'
  : '/';

console.log("App initializing... basename set to:", basename);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOHead />
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={["light", "dark", "cyberpunk", "ocean", "emerald", "rose", "forest", "midnight", "nova", "earth", "facebook"]}
    >
      <TooltipProvider>
        <SettingsProvider>
          <TestHistoryProvider>
            <GamificationProvider>
              <UserModeProvider>
                <CustomTextProvider>
                  <ExamProvider>
                    <UniversePulseProvider>
                      <BrandProvider>
                        <FocusWorkspaceProvider>
                          <Toaster />
                          <Sonner />
                          <DailyRewardModal />
                          <BrowserRouter basename={basename}>
                            <EconomyProvider>
                              <NotificationProvider>
                                <OSLayout>
                                  <Suspense fallback={<DashboardSkeleton />}>
                                    <Routes>
                                      <Route path="/" element={<Index />} />
                                      <Route path="/exams" element={<Exams />} />
                                      <Route path="/exams/mission/:id" element={<ExamMissionControl />} />
                                      <Route path="/global-exams" element={<GlobalExams />} />
                                      <Route path="/lessons" element={<Lessons />} />
                                      <Route path="/courses" element={<Courses />} />
                                      <Route path="/progressive-lessons" element={<ProgressiveLessons />} />
                                      <Route path="/games" element={<Games />} />
                                      <Route path="/statistics" element={<Statistics />} />
                                      <Route path="/achievements" element={<Achievements />} />
                                      <Route path="/leaderboard" element={<Leaderboard />} />
                                      <Route path="/settings" element={<Settings />} />
                                      <Route path="/ai-academy" element={<AIAcademy />} />
                                      <Route path="/earn" element={<Earn />} />
                                      <Route path="/clans" element={<Clans />} />
                                      <Route path="/war-zone" element={<ClanWarZone />} />
                                      <Route path="/tournaments" element={<Tournaments />} />
                                      <Route path="/season-pass" element={<SeasonPass />} />
                                      <Route path="/leaderboards" element={<GlobalLeaderboards />} />
                                      <Route path="/developer" element={<DeveloperPortal />} />
                                      <Route path="/community" element={<Community />} />
                                      <Route path="/verify" element={<CertificateVerify />} />
                                      <Route path="/number-symbol-practice" element={<NumberSymbolPractice />} />
                                      <Route path="/marketplace" element={<Marketplace />} />
                                      <Route path="/forge" element={<MissionMarketplace />} />
                                      <Route path="/forge/create" element={<ForgeEditor />} />
                                      <Route path="/clans" element={<Clans />} />
                                      <Route path="/book-library" element={<BookLibrary />} />
                                      <Route path="/book-reader/:bookId/:chapterId" element={<BookReader />} />
                                      <Route path="/word-crush" element={<WordCrush />} />
                                      <Route path="/skill-progression" element={<SkillProgression />} />
                                      <Route path="/mode-selection" element={<ModeSelection />} />
                                      <Route path="/school-dashboard" element={<SchoolDashboard />} />
                                      <Route path="/business-dashboard" element={<BusinessDashboard />} />
                                      <Route path="/home-dashboard" element={<Index />} />
                                      <Route path="/multiplayer-race" element={<MultiplayerRace />} />
                                      <Route path="/speed-typing" element={<TypingGame />} />
                                      <Route path="/neon-knight" element={<NeonKnight />} />
                                      <Route path="/heist-master" element={<HeistMaster />} />
                                      <Route path="/games/boss-battle" element={<BossBattleMode />} />
                                      <Route path="/dungeon" element={<TypeDungeon />} />
                                      <Route path="/pricing" element={<PricingPage />} />
                                      {/* <Route path="/os-login" element={<OSBootLogin />} /> */}
                                      <Route path="/cosmetics" element={<CosmeticsShop />} />
                                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                                      <Route path="/terms" element={<Terms />} />
                                      <Route path="/contact" element={<Contact />} />
                                      <Route path="/jobs" element={<Jobs />} />
                                      <Route path="/download" element={<Download />} />
                                      <Route path="/faq" element={<FAQ />} />
                                      <Route path="/user-guides" element={<UserGuides />} />
                                      <Route path="/whats-new" element={<WhatsNew />} />
                                      <Route path="/blog" element={<Blog />} />
                                      <Route path="/blog/:postId" element={<BlogPost />} />
                                      <Route path="/about" element={<About />} />
                                      <Route path="/brand" element={<Brand />} />
                                      <Route path="/security" element={<Security />} />
                                      <Route path="/accessibility" element={<Accessibility />} />
                                      <Route path="/referral-system" element={<ReferralSystem />} />
                                      <Route path="/zen" element={<Zen />} />
                                      <Route path="/custom-practice" element={<CustomPractice />} />
                                      <Route path="/blog-comments" element={<BlogCommentsPage />} />
                                      <Route path="/ai-coach" element={<AICoachPage />} />
                                      <Route path="/notifications" element={<Notifications />} />
                                      <Route path="/profile" element={<Profile />} />
                                      {/* SEO Landing Pages */}
                                      <Route path="/typing-speed-test" element={<TypingSpeedTestPage />} />
                                      <Route path="/typing-practice-online" element={<TypingPracticePage />} />
                                      <Route path="/wpm-calculator" element={<WpmCalculatorPage />} />
                                      {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
                                      <Route path="*" element={<NotFound />} />
                                    </Routes>
                                  </Suspense>
                                </OSLayout>
                                <CookieConsent />
                              </NotificationProvider>
                            </EconomyProvider>
                          </BrowserRouter>
                        </FocusWorkspaceProvider>
                      </BrandProvider>
                    </UniversePulseProvider>
                  </ExamProvider>
                </CustomTextProvider>
              </UserModeProvider>
            </GamificationProvider>
          </TestHistoryProvider>
        </SettingsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
