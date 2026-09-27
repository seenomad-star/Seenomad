import { useEffect, useState } from "react";
import { HandGesture } from "@/components/typing/HandGesture";
import { useGamification } from "@/contexts/GamificationContext";
import { keyboardLayouts, KeyboardLayout } from "@/data/keyboardLayouts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface VirtualKeyboardProps {
  currentChar?: string;
  pressedKey?: string;
  isCorrect?: boolean;
  showFingerGuide?: boolean;
  showHandGestures?: boolean;
  layout?: KeyboardLayout;
  onLayoutChange?: (layout: KeyboardLayout) => void;
}

// Finger color mapping for touch typing
const fingerColors = {
  leftPinky: "from-[#FF4E8E] to-[#FF005C]",
  leftRing: "from-[#FFB347] to-[#FF8C00]",
  leftMiddle: "from-[#FFD93D] to-[#FFC107]",
  leftIndex: "from-[#6BCB77] to-[#4CAF50]",
  rightIndex: "from-[#4D96FF] to-[#2196F3]",
  rightMiddle: "from-[#4B7BE5] to-[#3F51B5]",
  rightRing: "from-[#6C4AB6] to-[#673AB7]",
  rightPinky: "from-[#9C27B0] to-[#E91E63]",
  thumbs: "from-[#8E8E8E] to-[#424242]",
};

// Key to finger mapping (column-based, works for most layouts)
const getFingerForPosition = (rowIndex: number, keyIndex: number): keyof typeof fingerColors | null => {
  if (rowIndex === 4) return 'thumbs'; // Bottom row mostly thumbs for space

  const fingerByColumn: (keyof typeof fingerColors)[] = [
    'leftPinky', 'leftPinky', 'leftRing', 'leftMiddle', 'leftIndex', 'leftIndex',
    'rightIndex', 'rightIndex', 'rightMiddle', 'rightRing', 'rightPinky', 'rightPinky',
    'rightPinky', 'rightPinky'
  ];

  return fingerByColumn[keyIndex] || 'rightPinky';
};

const keyWidths: Record<string, string> = {
  'Backspace': 'w-12',
  'Tab': 'w-9',
  'Caps': 'w-10',
  'Enter': 'w-12',
  'Shift': 'w-14',
  'Space': 'w-32',
  'Ctrl': 'w-8',
  'Win': 'w-7',
  'Alt': 'w-8',
  'Fn': 'w-8',
};

// Home row positions (indices 0-7 for main keys)
const homeRowPositions = [0, 1, 2, 3, 6, 7, 8, 9];

export const VirtualKeyboard = ({
  currentChar,
  pressedKey,
  isCorrect = true,
  showFingerGuide = true,
  showHandGestures = true,
  layout = 'qwerty',
  onLayoutChange
}: VirtualKeyboardProps) => {
  const { userStats } = useGamification();
  const equippedKeycap = userStats.equippedCosmetics?.keycap || 'default';

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeFinger, setActiveFinger] = useState<keyof typeof fingerColors | null>(null);
  const [currentLayout, setCurrentLayout] = useState<KeyboardLayout>(layout);

  const layoutConfig = keyboardLayouts[currentLayout];
  const keyboardRows = layoutConfig.rows;

  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);

  useEffect(() => {
    if (pressedKey) {
      setActiveKey(pressedKey.toLowerCase());
      // Find finger for pressed key
      for (let rowIndex = 0; rowIndex < keyboardRows.length; rowIndex++) {
        const keyIndex = keyboardRows[rowIndex].findIndex(
          k => k.toLowerCase() === pressedKey.toLowerCase()
        );
        if (keyIndex !== -1) {
          setActiveFinger(getFingerForPosition(rowIndex, keyIndex));
          break;
        }
      }
      const timeout = setTimeout(() => {
        setActiveKey(null);
        setActiveFinger(null);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [pressedKey, keyboardRows]);

  // Update active finger based on current char to type
  useEffect(() => {
    if (currentChar && !activeKey) {
      const charLower = currentChar.toLowerCase();
      for (let rowIndex = 0; rowIndex < keyboardRows.length; rowIndex++) {
        const keyIndex = keyboardRows[rowIndex].findIndex(
          k => k.toLowerCase() === charLower || (k === 'Space' && currentChar === ' ')
        );
        if (keyIndex !== -1) {
          setActiveFinger(getFingerForPosition(rowIndex, keyIndex));
          break;
        }
      }
    }
  }, [currentChar, activeKey, keyboardRows]);

  const handleLayoutChange = (newLayout: KeyboardLayout) => {
    setCurrentLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  const getKeyClass = (key: string, rowIndex: number, keyIndex: number) => {
    const normalizedKey = key.toLowerCase();
    const normalizedCurrent = currentChar?.toLowerCase();
    const isCurrentKey = normalizedKey === normalizedCurrent ||
      (key === 'Space' && currentChar === ' ');
    const isPressed = activeKey === normalizedKey ||
      (key === 'Space' && activeKey === ' ');
    const isHomeRow = rowIndex === 2 && homeRowPositions.includes(keyIndex);
    const finger = getFingerForPosition(rowIndex, keyIndex);

    let baseClass = "relative flex items-center justify-center rounded-lg font-bold text-[10px] transition-all duration-150 border uppercase tracking-tight ";

    // Width
    baseClass += keyWidths[key] || 'w-8';
    baseClass += " h-8 ";

    // Pressed state
    if (isPressed) {
      if (isCorrect) {
        baseClass += "bg-emerald-500 text-white border-emerald-600 shadow-lg translate-y-0.5 ";
      } else {
        baseClass += "bg-rose-500 text-white border-rose-600 shadow-lg translate-y-0.5 ";
      }
    }
    // Current key to press (highlight)
    else if (isCurrentKey && showFingerGuide) {
      baseClass += "bg-amber-500/10 text-amber-600 border-amber-500 animate-pulse shadow-md z-10 ";
    }
    // Default state with Skins
    else {
      switch (equippedKeycap) {
        case 'keycap_neon':
          baseClass += "bg-black text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-mono ";
          break;
        case 'keycap_retro':
          baseClass += "bg-[#d1d1d1] text-[#4a4a4a] border-[#a0a0a0] border-b-4 shadow-md font-serif ";
          break;
        case 'keycap_carbon':
          baseClass += "bg-[#1c1c1c] text-white/70 border-white/10 shadow-inner opacity-90 ";
          break;
        case 'keycap_gold':
          baseClass += "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-700 shadow-lg font-black ";
          break;
        case 'keycap_holographic':
          baseClass += "bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300 text-purple-900 border-white/40 shadow-xl ";
          break;
        default:
          baseClass += "bg-white dark:bg-[#25282C] text-foreground/40 border-black/5 dark:border-white/5 shadow-sm hover:border-black/10 dark:hover:border-white/10 ";
      }
    }

    return baseClass;
  };

  const getFingerIndicator = (rowIndex: number, keyIndex: number) => {
    if (!showFingerGuide) return null;
    const finger = getFingerForPosition(rowIndex, keyIndex);
    if (!finger) return null;

    return (
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-gradient-to-r ${fingerColors[finger]} opacity-40`}
        aria-hidden="true"
      />
    );
  };

  const isLeftHandFinger = activeFinger?.startsWith('left') || false;
  const isRightHandFinger = activeFinger?.startsWith('right') || false;
  const isThumb = activeFinger === 'thumbs';

  const getKeyDisplay = (key: string) => {
    switch (key) {
      case 'Space': return '';
      case 'Backspace': return '';
      case 'Enter': return '';
      case 'Tab': return 'TAB';
      case 'Caps': return 'CAPS';
      case 'Shift': return 'SHIFT';
      case 'Ctrl': return 'CTRL';
      case 'Win': return 'WIN';
      case 'Alt': return 'ALT';
      default: return key;
    }
  };

  return (
    <div className="w-full" role="region" aria-label="Virtual Keyboard Guide">
      {/* Header with Layout Selector */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Keyboard Engine: {layoutConfig.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] rounded-full border border-white/5 backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-primary opacity-60" />
            <Select value={currentLayout} onValueChange={(v) => handleLayoutChange(v as KeyboardLayout)}>
              <SelectTrigger className="w-36 h-6 text-[9px] font-black border-0 bg-transparent shadow-none focus:ring-0 uppercase tracking-widest p-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1C1E] border-white/10 rounded-2xl">
                {Object.entries(keyboardLayouts).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="text-[10px] font-black uppercase tracking-widest">
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Hand Gestures + Keyboard Layout */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-12">
        {/* Left Hand */}
        {showHandGestures && (
          <div className="flex opacity-60 hover:opacity-100 transition-opacity duration-1000 scale-50 sm:scale-75 lg:scale-90 origin-right" aria-hidden="true">
            <HandGesture
              activeFinger={isLeftHandFinger || isThumb ? activeFinger : null}
              isLeft={true}
            />
          </div>
        )}

        {/* Keyboard */}
        <div className="flex flex-col items-center gap-1 shrink-0" role="group" aria-label="Keyboard Layout">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((key, keyIndex) => (
                <button
                  key={`${rowIndex}-${keyIndex}`}
                  className={getKeyClass(key, rowIndex, keyIndex)}
                  tabIndex={-1}
                  aria-label={key === 'Space' ? 'Space' : key}
                  data-pressed={activeKey === key.toLowerCase() ? "true" : "false"}
                  aria-current={currentChar?.toLowerCase() === key.toLowerCase() || (key === 'Space' && currentChar === ' ') ? 'true' : undefined}
                >
                  <span className="relative z-10" aria-hidden="true">
                    {getKeyDisplay(key)}
                  </span>
                  {getFingerIndicator(rowIndex, keyIndex)}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right Hand */}
        {showHandGestures && (
          <div className="flex opacity-60 hover:opacity-100 transition-opacity duration-1000 scale-50 sm:scale-75 lg:scale-90 origin-left" aria-hidden="true">
            <HandGesture
              activeFinger={isRightHandFinger || isThumb ? activeFinger : null}
              isLeft={false}
            />
          </div>
        )}
      </div>

      {/* Finger Guide Legend */}
      {showFingerGuide && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(fingerColors).filter(([k]) => k !== 'thumbs').slice(0, 8).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2 group" aria-label={`${name} indicator`}>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${color} shadow-lg shadow-black/20 group-hover:scale-125 transition-transform duration-300`} aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 group-hover:text-foreground/60 transition-colors">
                  {name.replace('left', '').replace('right', '').replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 group">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${fingerColors.thumbs} group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-black/10`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 group-hover:text-foreground/60 transition-colors">Spacebar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualKeyboard;
