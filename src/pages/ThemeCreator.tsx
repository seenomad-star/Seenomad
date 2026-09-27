import { useState, useEffect } from "react";
import { Palette, Save, RotateCcw, Keyboard, Eye, Download, Upload, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    card: string;
    muted: string;
  };
  keyboard: {
    layout: string;
    keyBackground: string;
    keyText: string;
    activeKey: string;
    correctKey: string;
    incorrectKey: string;
  };
}

const defaultTheme: CustomTheme = {
  name: "My Custom Theme",
  colors: {
    background: "#1a1b26",
    foreground: "#c0caf5",
    primary: "#f59e0b",
    secondary: "#3b4261",
    accent: "#bb9af7",
    card: "#24283b",
    muted: "#565f89",
  },
  keyboard: {
    layout: "qwerty",
    keyBackground: "#24283b",
    keyText: "#c0caf5",
    activeKey: "#f59e0b",
    correctKey: "#9ece6a",
    incorrectKey: "#f7768e",
  },
};

const presetThemes: { name: string; theme: CustomTheme }[] = [
  {
    name: "Tokyo Night",
    theme: {
      ...defaultTheme,
      name: "Tokyo Night",
      colors: {
        background: "#1a1b26",
        foreground: "#c0caf5",
        primary: "#7aa2f7",
        secondary: "#3b4261",
        accent: "#bb9af7",
        card: "#24283b",
        muted: "#565f89",
      },
    },
  },
  {
    name: "Dracula",
    theme: {
      name: "Dracula",
      colors: {
        background: "#282a36",
        foreground: "#f8f8f2",
        primary: "#ff79c6",
        secondary: "#44475a",
        accent: "#bd93f9",
        card: "#21222c",
        muted: "#6272a4",
      },
      keyboard: {
        layout: "qwerty",
        keyBackground: "#44475a",
        keyText: "#f8f8f2",
        activeKey: "#ff79c6",
        correctKey: "#50fa7b",
        incorrectKey: "#ff5555",
      },
    },
  },
  {
    name: "Nord",
    theme: {
      name: "Nord",
      colors: {
        background: "#2e3440",
        foreground: "#eceff4",
        primary: "#88c0d0",
        secondary: "#3b4252",
        accent: "#b48ead",
        card: "#3b4252",
        muted: "#4c566a",
      },
      keyboard: {
        layout: "qwerty",
        keyBackground: "#3b4252",
        keyText: "#eceff4",
        activeKey: "#88c0d0",
        correctKey: "#a3be8c",
        incorrectKey: "#bf616a",
      },
    },
  },
  {
    name: "Monokai",
    theme: {
      name: "Monokai",
      colors: {
        background: "#272822",
        foreground: "#f8f8f2",
        primary: "#f92672",
        secondary: "#3e3d32",
        accent: "#ae81ff",
        card: "#3e3d32",
        muted: "#75715e",
      },
      keyboard: {
        layout: "qwerty",
        keyBackground: "#3e3d32",
        keyText: "#f8f8f2",
        activeKey: "#f92672",
        correctKey: "#a6e22e",
        incorrectKey: "#f92672",
      },
    },
  },
  {
    name: "Solarized",
    theme: {
      name: "Solarized",
      colors: {
        background: "#002b36",
        foreground: "#839496",
        primary: "#b58900",
        secondary: "#073642",
        accent: "#268bd2",
        card: "#073642",
        muted: "#586e75",
      },
      keyboard: {
        layout: "qwerty",
        keyBackground: "#073642",
        keyText: "#839496",
        activeKey: "#b58900",
        correctKey: "#859900",
        incorrectKey: "#dc322f",
      },
    },
  },
];

const keyboardLayouts = [
  { value: "qwerty", label: "QWERTY (US)" },
  { value: "qwertz", label: "QWERTZ (German)" },
  { value: "azerty", label: "AZERTY (French)" },
  { value: "dvorak", label: "Dvorak" },
  { value: "colemak", label: "Colemak" },
];

const qwertyLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export function ThemeCreator() {
  const [customTheme, setCustomTheme] = useState<CustomTheme>(defaultTheme);
  const [savedThemes, setSavedThemes] = useState<CustomTheme[]>([]);
  const [activePreview, setActivePreview] = useState<"colors" | "keyboard">("colors");

  useEffect(() => {
    const saved = localStorage.getItem("typingCustomThemes");
    if (saved) {
      setSavedThemes(JSON.parse(saved));
    }
  }, []);

  const updateColor = (key: keyof CustomTheme["colors"], value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const updateKeyboard = (key: keyof CustomTheme["keyboard"], value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      keyboard: { ...prev.keyboard, [key]: value },
    }));
  };

  const saveTheme = () => {
    const newThemes = [...savedThemes, customTheme];
    setSavedThemes(newThemes);
    localStorage.setItem("typingCustomThemes", JSON.stringify(newThemes));
    toast.success(`Theme "${customTheme.name}" saved!`);
  };

  const loadPreset = (preset: CustomTheme) => {
    setCustomTheme(preset);
    toast.success(`Loaded "${preset.name}" preset`);
  };

  const applyTheme = () => {
    localStorage.setItem("activeCustomTheme", JSON.stringify(customTheme));
    toast.success("Theme applied! Refresh to see changes.");
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(customTheme, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", `${customTheme.name.replace(/\s+/g, "-").toLowerCase()}.json`);
    link.click();
    toast.success("Theme exported!");
  };

  return (
    <Card className="p-6 bg-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Custom Theme Creator</h2>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="w-3 h-3" />
          Pro Feature
        </Badge>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Start with a preset and customize it to your liking
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset.theme)}
                className="p-4 rounded-lg border border-border hover:border-primary transition-colors text-left"
                style={{ backgroundColor: preset.theme.colors.background }}
              >
                <div className="flex gap-1 mb-2">
                  {Object.values(preset.theme.colors).slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium" style={{ color: preset.theme.colors.foreground }}>
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-2 block">Theme Name</Label>
              <Input
                value={customTheme.name}
                onChange={(e) => setCustomTheme((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="My Custom Theme"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customTheme.colors).map(([key, value]) => (
                <div key={key}>
                  <Label className="text-foreground mb-2 block capitalize">{key}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) => updateColor(key as keyof CustomTheme["colors"], e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateColor(key as keyof CustomTheme["colors"], e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Color Preview */}
            <div
              className="p-6 rounded-lg mt-4"
              style={{ backgroundColor: customTheme.colors.background }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: customTheme.colors.foreground }}>
                Preview
              </h3>
              <p className="text-sm mb-4" style={{ color: customTheme.colors.muted }}>
                This is how your theme will look
              </p>
              <div
                className="p-4 rounded-lg mb-3"
                style={{ backgroundColor: customTheme.colors.card }}
              >
                <span style={{ color: customTheme.colors.foreground }}>Card content with </span>
                <span style={{ color: customTheme.colors.primary }}>primary</span>
                <span style={{ color: customTheme.colors.foreground }}> and </span>
                <span style={{ color: customTheme.colors.accent }}>accent</span>
                <span style={{ color: customTheme.colors.foreground }}> colors</span>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: customTheme.colors.primary, color: customTheme.colors.background }}
              >
                Primary Button
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keyboard" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-2 block">Keyboard Layout</Label>
              <Select
                value={customTheme.keyboard.layout}
                onValueChange={(value) => updateKeyboard("layout", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {keyboardLayouts.map((layout) => (
                    <SelectItem key={layout.value} value={layout.value}>
                      {layout.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground mb-2 block">Key Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.keyboard.keyBackground}
                    onChange={(e) => updateKeyboard("keyBackground", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={customTheme.keyboard.keyBackground}
                    onChange={(e) => updateKeyboard("keyBackground", e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Key Text</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.keyboard.keyText}
                    onChange={(e) => updateKeyboard("keyText", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={customTheme.keyboard.keyText}
                    onChange={(e) => updateKeyboard("keyText", e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Active Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.keyboard.activeKey}
                    onChange={(e) => updateKeyboard("activeKey", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={customTheme.keyboard.activeKey}
                    onChange={(e) => updateKeyboard("activeKey", e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Correct Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.keyboard.correctKey}
                    onChange={(e) => updateKeyboard("correctKey", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={customTheme.keyboard.correctKey}
                    onChange={(e) => updateKeyboard("correctKey", e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Incorrect Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.keyboard.incorrectKey}
                    onChange={(e) => updateKeyboard("incorrectKey", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={customTheme.keyboard.incorrectKey}
                    onChange={(e) => updateKeyboard("incorrectKey", e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Keyboard Preview */}
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: customTheme.colors.background }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className="w-4 h-4" style={{ color: customTheme.colors.foreground }} />
                <span className="text-sm font-medium" style={{ color: customTheme.colors.foreground }}>
                  Keyboard Preview
                </span>
              </div>
              <div className="space-y-2">
                {qwertyLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key, keyIndex) => {
                      const isActive = key === "F" || key === "J";
                      const isCorrect = key === "A" || key === "S";
                      const isIncorrect = key === "Z";
                      return (
                        <div
                          key={key}
                          className="w-9 h-9 rounded flex items-center justify-center text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: isActive
                              ? customTheme.keyboard.activeKey
                              : isCorrect
                              ? customTheme.keyboard.correctKey
                              : isIncorrect
                              ? customTheme.keyboard.incorrectKey
                              : customTheme.keyboard.keyBackground,
                            color: isActive || isCorrect || isIncorrect
                              ? customTheme.colors.background
                              : customTheme.keyboard.keyText,
                          }}
                        >
                          {key}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: customTheme.colors.muted }}>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: customTheme.keyboard.activeKey }} />
                  Active
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: customTheme.keyboard.correctKey }} />
                  Correct
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: customTheme.keyboard.incorrectKey }} />
                  Incorrect
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
        <Button onClick={saveTheme} className="gap-2">
          <Save className="w-4 h-4" />
          Save Theme
        </Button>
        <Button onClick={applyTheme} variant="secondary" className="gap-2">
          <Check className="w-4 h-4" />
          Apply Theme
        </Button>
        <Button onClick={exportTheme} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button onClick={() => setCustomTheme(defaultTheme)} variant="ghost" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {savedThemes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Saved Themes</h3>
          <div className="flex flex-wrap gap-2">
            {savedThemes.map((theme, index) => (
              <button
                key={index}
                onClick={() => setCustomTheme(theme)}
                className="px-3 py-2 rounded-lg border border-border hover:border-primary transition-colors text-sm flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
