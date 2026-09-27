import React, { useRef, useEffect } from "react";
import { cn } from "@/utils/utils";

interface HandGestureProps {
  activeFinger: string | null;
  isLeft: boolean;
}

const fingerColors: Record<string, string> = {
  leftPinky: "#FF4E8E",
  leftRing: "#FFB347",
  leftMiddle: "#FFD93D",
  leftIndex: "#6BCB77",
  rightIndex: "#4D96FF",
  rightMiddle: "#4B7BE5",
  rightRing: "#6C4AB6",
  rightPinky: "#9C27B0",
  thumbs: "#8E8E8E",
};

export const HandGesture: React.FC<HandGestureProps> = ({ activeFinger, isLeft }) => {
  const prefix = isLeft ? "left" : "right";
  const isActive = !!activeFinger && (activeFinger === "thumbs" || activeFinger.startsWith(prefix));

  // Refs for each finger group so we can set styles imperatively (avoids JSX style= lint warning)
  const pinkyRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const middleRef = useRef<SVGGElement>(null);
  const indexRef = useRef<SVGGElement>(null);
  const thumbRef = useRef<SVGGElement>(null);

  const getFingerOpacity = (finger: string) => {
    if (!activeFinger) return 0.4;
    return activeFinger === finger ? 1.0 : 0.15;
  };

  const getFingerGlow = (finger: string) => {
    if (activeFinger === finger) {
      return `drop-shadow(0 0 12px ${fingerColors[finger]}) drop-shadow(0 0 4px ${fingerColors[finger]})`;
    }
    return "none";
  };

  // Apply opacity + filter imperatively on every render instead of via JSX style=
  useEffect(() => {
    const fingers: [React.RefObject<SVGGElement>, string][] = [
      [pinkyRef, `${prefix}Pinky`],
      [ringRef, `${prefix}Ring`],
      [middleRef, `${prefix}Middle`],
      [indexRef, `${prefix}Index`],
      [thumbRef, "thumbs"],
    ];
    fingers.forEach(([ref, name]) => {
      if (ref.current) {
        ref.current.style.opacity = String(getFingerOpacity(name));
        ref.current.style.filter = getFingerGlow(name);
      }
    });
  });

  return (
    <div className={cn(
      "relative w-24 h-32 transition-all duration-500",
      isActive ? "opacity-100 scale-105" : "opacity-70 scale-100"
    )}>
      <svg
        viewBox="0 0 100 120"
        className={cn("w-full h-full drop-shadow-xl", isLeft && "-scale-x-100")}
      >
        {/* Palm Outline */}
        <path
          d="M 20 85 Q 20 115 50 115 Q 80 115 80 85 Q 80 75 70 70 L 30 70 Q 20 75 20 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary/20 dark:text-white/20"
        />
        <path
          d="M 25 85 Q 25 110 50 110 Q 75 110 75 85"
          fill="currentColor"
          className="text-primary/[0.08] dark:text-white/[0.08]"
        />

        {/* Pinky */}
        <g ref={pinkyRef} className="transition-all duration-200 ease-in-out">
          <rect x="78" y="45" width="12" height="35" rx="6" fill={fingerColors[`${prefix}Pinky`]} />
          <circle cx="84" cy="45" r="6" fill={fingerColors[`${prefix}Pinky`]} />
        </g>

        {/* Ring */}
        <g ref={ringRef} className="transition-all duration-200 ease-in-out">
          <rect x="62" y="25" width="12" height="45" rx="6" fill={fingerColors[`${prefix}Ring`]} />
          <circle cx="68" cy="25" r="6" fill={fingerColors[`${prefix}Ring`]} />
        </g>

        {/* Middle */}
        <g ref={middleRef} className="transition-all duration-200 ease-in-out">
          <rect x="44" y="15" width="12" height="50" rx="6" fill={fingerColors[`${prefix}Middle`]} />
          <circle cx="50" cy="15" r="6" fill={fingerColors[`${prefix}Middle`]} />
        </g>

        {/* Index */}
        <g ref={indexRef} className="transition-all duration-200 ease-in-out">
          <rect x="26" y="25" width="12" height="45" rx="6" fill={fingerColors[`${prefix}Index`]} />
          <circle cx="32" cy="25" r="6" fill={fingerColors[`${prefix}Index`]} />
        </g>

        {/* Thumb */}
        <g ref={thumbRef} className="transition-all duration-200 ease-in-out">
          <ellipse
            cx="18"
            cy="75"
            rx="10"
            ry="18"
            fill={fingerColors.thumbs}
            transform="rotate(-30 18 75)"
          />
        </g>
      </svg>

      {/* Hand Label Overlay */}
      <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 dark:text-white/20">
          {isLeft ? "Left" : "Right"}
        </span>
      </div>
    </div>
  );
};

export default HandGesture;
