import React, { useRef, useEffect, useState } from "react";
import { QuantumParticles } from "./QuantumParticles";

interface TypingDisplayProps {
  text: string;
  userInput: string;
  currentIndex: number;
  isHindi?: boolean;
  shadows?: { id: string, index: number, color: string }[];
  particleTrigger?: number;
}

export const TypingDisplay: React.FC<TypingDisplayProps> = ({
  text,
  userInput,
  currentIndex,
  isHindi = false,
  shadows = [],
  particleTrigger = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (currentCharRef.current) {
      const rect = currentCharRef.current.getBoundingClientRect();
      setCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, [particleTrigger]);

  // Auto-scroll to keep current character visible
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const currentChar = currentCharRef.current;

      const containerRect = container.getBoundingClientRect();
      const charRect = currentChar.getBoundingClientRect();

      // Check if current char is below the visible area
      if (charRect.top > containerRect.bottom - 60) {
        container.scrollTop += charRect.top - containerRect.top - 40;
      }
      // Check if current char is above the visible area
      else if (charRect.top < containerRect.top + 20) {
        container.scrollTop -= containerRect.top - charRect.top + 40;
      }
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative text-[14pt] lg:text-[12pt] leading-snug tracking-tight select-none max-h-[240px] overflow-y-auto scroll-smooth pr-2 ${isHindi ? "font-hindi" : "font-sans font-medium"
        }`}
      role="region"
      aria-label="Typing text area"
    >
      <QuantumParticles x={coords.x} y={coords.y} trigger={particleTrigger} />
      {text.split("").map((char, index) => {
        let className = "char-pending transition-colors duration-100";
        const isCurrent = index === currentIndex;

        if (index < userInput.length) {
          if (userInput[index] === char) {
            className = "char-correct";
          } else {
            className = "char-incorrect";
          }
        } else if (isCurrent) {
          className = "char-current";
        } else {
          className = "char-pending";
        }

        return (
          <span
            key={index}
            ref={isCurrent ? currentCharRef : null}
            className={`relative ${className}`}
            aria-current={isCurrent ? "true" : undefined}
          >
            {shadows.map(shadow => Math.floor(shadow.index) === index && (
              <span
                key={shadow.id}
                className={`absolute left-0 bottom-0 w-full h-[2px] opacity-40 animate-pulse ${shadow.color || 'bg-blue-400'}`}
              />
            ))}
            {char}
          </span>
        );
      })}
    </div>
  );
};
