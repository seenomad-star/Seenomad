import { Mail, MessageSquare, MapPin, Phone, Send, Globe, Zap, ExternalLink, Headphones, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/utils";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(t("Protocol Error"), {
        description: t("Please populate all required transmission fields.")
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate transmission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success(t("Transmission Confirmed"), {
      description: t("Your inquiry has been routed to the Nexus support team.")
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  const contactOptions = [
    {
      title: "Support Hub",
      desc: "For technical bugs, account recovery, or general help.",
      email: "support@typingos.com",
      icon: Headphones,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Partnerships",
      desc: "Media inquiries, brand collabs, or enterprise integration.",
      email: "legal@typingos.com",
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-500/10"
    },
    {
      title: "Legal & Privacy",
      desc: "Queries regarding cookies, data, or terms of service.",
      email: "privacy@typingos.com",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <div className="max-w-6xl mx-auto px-6 py-4 md:py-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('Nexus Support Terminal')}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            {t('Contact')} <span className="text-primary">{t('The OS')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            {t('Have a vision, found a bug, or need a rescue? Our agents are standing by to process your transmissions.')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left Column: Contact Cards & Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid gap-4">
              {contactOptions.map((opt, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-secondary/10 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                    <CardContent className="p-6 flex gap-5 items-start">
                      <div className={cn("p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform", opt.bg, opt.color)}>
                        <opt.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black uppercase tracking-wider text-sm">{t(opt.title)}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t(opt.desc)}</p>
                        <a href={`mailto:${opt.email}`} className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-2">
                          {opt.email} <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t('Protocol Resources')}</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Community", link: "/community", icon: MessageSquare },
                  { label: "Help Docs", link: "/user-guides", icon: Globe },
                  { label: "GitHub", link: "https://github.com", icon: ExternalLink, external: true },
                  { label: "Dev Portal", link: "/developer", icon: Zap }
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.external ? '#' : link.link}
                    onClick={() => link.external && window.open(link.link, '_blank')}
                    className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {t(link.label)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 px-2">
              {["Terms", "Privacy", "Cookies", "Jobs"].map((legal) => (
                <Link
                  key={legal}
                  to={`/${legal.toLowerCase().replace(' ', '-')}${legal === 'Terms' ? '' : '-policy'}`}
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(legal === 'Terms' ? 'Terms of Service' : legal)}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-white/10 bg-secondary/5 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                <div className="p-8 md:p-12 space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{t('Initialize Transmission')}</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Secure Support Protocol v2.4</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Pilot Name')}</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your identity..."
                          className="h-12 bg-white/5 border-white/5 focus:ring-primary/20 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Frequency Address')}</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="h-12 bg-white/5 border-white/5 focus:ring-primary/20 rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Transmission Subject')}</Label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What is the objective?"
                        className="h-12 bg-white/5 border-white/5 focus:ring-primary/20 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Mission Brief Details')}</Label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detail your inquiry components..."
                        className="min-h-[160px] bg-white/5 border-white/5 focus:ring-primary/20 rounded-2xl resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 group overflow-hidden relative"
                      disabled={isSubmitting}
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.span
                            key="submitting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4 animate-spin" />
                            {t('Transmitting...')}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            {t('Broadcast Transmission')}
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Global Stats or Office Locations could go here */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 pt-12 border-t border-white/5 grid md:grid-cols-3 gap-12 text-center"
        >
          <div className="space-y-2">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <h5 className="font-black uppercase tracking-widest text-xs">{t('Nexus Command')}</h5>
            <p className="text-muted-foreground text-[11px] uppercase tracking-tighter">San Francisco, CA • Distributed Core</p>
          </div>
          <div className="space-y-2">
            <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
            <h5 className="font-black uppercase tracking-widest text-xs">{t('Emergency Uplink')}</h5>
            <p className="text-muted-foreground text-[11px] uppercase tracking-tighter">+1 (555) 123-4567 • Mon-Fri 0900-1800 EST</p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <h5 className="font-black uppercase tracking-widest text-xs">{t('Secure Transmission')}</h5>
            <p className="text-muted-foreground text-[11px] uppercase tracking-tighter">AES-256 Encrypted Protocol v2.5</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
