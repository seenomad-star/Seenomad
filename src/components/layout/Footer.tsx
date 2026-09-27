
import { Link } from "react-router-dom";
import { Globe, Facebook, Twitter, Instagram, Linkedin, Rss, Sparkles, Mail, ShieldCheck, Heart, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { Logo } from "../shared/Logo";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    toast.success(t("Welcome to the Neural Network!"), {
      description: t("You've successfully subscribed to our OS updates."),
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />
    });
    setEmail("");
  };

  return (
    <footer className="relative mt-0 border-t border-border/50 bg-card/40 backdrop-blur-3xl overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_40px_rgba(var(--primary),0.5)]" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-4">

          {/* Brand/OS Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
                <Logo size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter uppercase italic leading-none text-foreground">TypingOS <span className="text-primary text-[10px] not-italic align-top">SYS</span></span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">{t('Neural Typing System')}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t("The world's most advanced typing operating system, designed for neural mastery, competitive e-sports, and global skill excellence.")}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Linkedin, href: "https://linkedin.com" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.icon.name}
                  aria-label={`Visit our ${social.icon.name} page`}
                  className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 hover:bg-primary/20 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all flex items-center justify-center group"
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section (2 Cols x 3) */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Resources */}
            <div className="space-y-6">
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white/40">{t('Product')}</h3>
              <ul className="space-y-4">
                {[
                  { label: t("Typing Test"), href: "/" },
                  { label: t("Pro Lessons"), href: "/progressive-lessons" },
                  { label: t("Global Exams"), href: "/global-exams" },
                  { label: t("Multiplayer"), href: "/multiplayer-race" },
                  { label: t("AI Coach"), href: "/ai-academy" },
                  { label: t("Typing Games"), href: "/games" },
                  { label: t("Word Crush"), href: "/word-crush" },
                  { label: t("Pricing"), href: "/marketplace" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white/40">{t('Company')}</h3>
              <ul className="space-y-4">
                {[
                  { label: t("About OS"), href: "/about" },
                  { label: t("Blog"), href: "/blog" },
                  { label: t("Careers"), href: "/jobs" },
                  { label: t("Brand Kit"), href: "/brand" },
                  { label: t("Contact"), href: "/contact" },
                  { label: t("Community"), href: "/community" },
                  { label: t("Leaderboards"), href: "/leaderboard" },
                  { label: t("Referral Program"), href: "/referral-system" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white/40">{t('Legal')}</h3>
              <ul className="space-y-4">
                {[
                  { label: t("Privacy Policy"), href: "/privacy-policy" },
                  { label: t("Terms of Service"), href: "/terms" },
                  { label: t("Cookie Policy"), href: "/cookie-policy" },
                  { label: t("Security"), href: "/security" },
                  { label: t("Accessibility"), href: "/accessibility" },
                  { label: t("User Agreements"), href: "/terms" },
                  { label: t("GDPR Compliance"), href: "/privacy-policy" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white/40">{t('Stay Synced')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('Join 50,000+ typists receiving weekly drills and OS updates.')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t("Enter neural ID (email)")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-10 rounded-xl text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-widest text-[10px] h-10 rounded-xl group">
                {t('Initialise Link')}
                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

        </div>

        {/* System Status & Copyright */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{t('All Systems Operational')}</span>
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 opacity-60">
            <span>© {currentYear} TypingOS Inc.</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{t('Designed with')}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500/20 animate-pulse" />
            <span>{t('in Cyber-Space')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
