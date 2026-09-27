import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import {
  Settings as SettingsIcon, Volume2, Palette, Type, Bell,
  Monitor, FileText, Play, X, Sun, Moon, Laptop,
  Paintbrush
} from "lucide-react";
import { ThemeCreator } from "@/pages/ThemeCreator";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCustomText } from "@/contexts/CustomTextContext";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { ReferralSystem } from "@/pages/ReferralSystem";
import { cn } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  const { customText, setAndActivate, clearCustomText } = useCustomText();
  const [textInput, setTextInput] = useState(customText.text);

  const handleStartCustomPractice = () => {
    if (textInput.trim().length < 10) {
      toast.error(t("Please enter at least 10 characters"));
      return;
    }
    setAndActivate(textInput.trim());
    toast.success(t("Custom text ready! Redirecting..."));
    setTimeout(() => navigate("/"), 500);
  };

  const handleClearCustomText = () => {
    setTextInput("");
    clearCustomText();
    toast.success(t("Custom text cleared"));
  };

  const wordCount = textInput.trim().split(/\s+/).filter(Boolean).length;
  const charCount = textInput.length;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('Settings')}</h1>
        </div>
        <p className="text-muted-foreground">{t('Customize your typing experience')}</p>
      </div>

      <div className="space-y-6">
        {/* Custom Text Practice */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Custom Text Practice')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-2 block">
                {t('Paste your own text to practice typing')}
              </Label>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t("Paste or type your custom paragraph here...")}
                className="min-h-[150px] resize-none bg-secondary/30"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{wordCount} {t('words')} · {charCount} {t('characters')}</span>
                {customText.isActive && (
                  <span className="text-success">{t('Custom text active')}</span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleStartCustomPractice}
                disabled={textInput.trim().length < 10}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                {t('Start Practice')}
              </Button>
              {textInput && (
                <Button
                  variant="outline"
                  onClick={handleClearCustomText}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  {t('Clear')}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Appearance')}</h2>
          </div>
          <div className="space-y-6">
            <div>
              <Label className="text-foreground mb-4 block">{t('OS Theme')}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: "light", name: t("Light"), color: "bg-white", border: "border-gray-200", icon: <Sun className="w-4 h-4" /> },
                  { id: "dark", name: t("Dark"), color: "bg-[#1A1C1E]", border: "border-white/10", icon: <Moon className="w-4 h-4" /> },
                  { id: "cyberpunk", name: t("Cyberpunk"), color: "bg-[#0A050F]", border: "border-pink-500/30", primary: "bg-[#FF00FF]" },
                  { id: "ocean", name: t("Ocean"), color: "bg-[#080B0F]", border: "border-blue-500/30", primary: "bg-[#00A3FF]" },
                  { id: "emerald", name: t("Emerald"), color: "bg-[#070D0B]", border: "border-emerald-500/30", primary: "bg-[#10B981]" },
                  { id: "rose", name: t("Rose Gold"), color: "bg-[#0F080A]", border: "border-rose-500/30", primary: "bg-[#FB7185]" },
                  { id: "forest", name: t("Forest"), color: "bg-[#060A08]", border: "border-green-500/30", primary: "bg-[#22C55E]" },
                  { id: "midnight", name: t("Midnight"), color: "bg-[#030308]", border: "border-purple-500/30", primary: "bg-[#9333EA]" },
                  { id: "nova", name: t("Nova"), color: "bg-[#0A040F]", border: "border-orange-500/30", primary: "bg-[#F97316]" },
                  { id: "earth", name: t("Earth"), color: "bg-[#F5F5F3]", border: "border-stone-400/30", primary: "bg-[#78350F]" },
                  { id: "facebook", name: t("Facebook"), color: "bg-[#F0F2F5]", border: "border-[#1877F2]/30", primary: "bg-[#1877F2]" },
                ].map((t_item) => (
                  <button
                    key={t_item.id}
                    onClick={() => setTheme(t_item.id)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300",
                      theme === t_item.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-transparent hover:border-primary/50 bg-secondary/20"
                    )}
                  >
                    <div className={cn(
                      "w-full aspect-[4/3] rounded-xl flex items-center justify-center relative overflow-hidden",
                      t_item.color,
                      t_item.border,
                      "border shadow-inner"
                    )}>
                      {t_item.primary && (
                        <div className={cn("absolute bottom-2 right-2 w-4 h-4 rounded-full shadow-lg", t_item.primary)} />
                      )}
                      {t_item.icon ? (
                        <div className="text-muted-foreground">{t_item.icon}</div>
                      ) : (
                        <div className="w-6 h-1 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                      {t_item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Sound Settings */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Sound')}</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="text-foreground">
                {t('Typing Sound Effects')}
              </Label>
              <Switch
                id="sound-effects"
                checked={settings.soundEnabled}
                onCheckedChange={(val) => updateSetting('soundEnabled', val)}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">{t('Volume')}</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={(val) => updateSetting('volume', val[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Type className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Typography')}</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">{t('Font Family')}</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(val) => updateSetting('fontFamily', val)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                  <SelectItem value="fira">Fira Code</SelectItem>
                  <SelectItem value="source">Source Code Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-foreground">{t('Font Size')}</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(val) => updateSetting('fontSize', val[0])}
                min={16}
                max={36}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Test Settings */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Test Settings')}</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">{t('Default Word Count')}</Label>
              <Select
                value={settings.wordCount.toString()}
                onValueChange={(val) => updateSetting('wordCount', parseInt(val))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 {t('words')}</SelectItem>
                  <SelectItem value="30">30 {t('words')}</SelectItem>
                  <SelectItem value="50">50 {t('words')}</SelectItem>
                  <SelectItem value="100">100 {t('words')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smooth-caret" className="text-foreground">
                {t('Smooth Caret')}
              </Label>
              <Switch
                id="smooth-caret"
                checked={settings.smoothCaret}
                onCheckedChange={(val) => updateSetting('smoothCaret', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="live-wpm" className="text-foreground">
                {t('Show Live WPM')}
              </Label>
              <Switch
                id="live-wpm"
                checked={settings.liveWPM}
                onCheckedChange={(val) => updateSetting('liveWPM', val)}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('Notifications')}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder" className="text-foreground">
                {t('Daily Practice Reminder')}
              </Label>
              <Switch
                id="daily-reminder"
                checked={settings.dailyReminder}
                onCheckedChange={(val) => updateSetting('dailyReminder', val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="achievements" className="text-foreground">
                {t('Achievement Notifications')}
              </Label>
              <Switch
                id="achievements"
                checked={settings.achievementNotifications}
                onCheckedChange={(val) => updateSetting('achievementNotifications', val)}
              />
            </div>
          </div>
        </Card>

        {/* Custom Theme Creator */}
        <ThemeCreator />

        {/* Referral System */}
        <ReferralSystem />
      </div>
    </div>
  );
}
