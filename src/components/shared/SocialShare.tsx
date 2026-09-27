import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Twitter, Facebook, Linkedin, Copy, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGamification } from "@/contexts/GamificationContext";

interface SocialShareProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  correctChars: number;
  totalChars: number;
  passed?: boolean;
  examName?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  wpm,
  accuracy,
  timeElapsed,
  correctChars,
  totalChars,
  passed,
  examName,
}) => {
  const { userStats } = useGamification();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareText = `🎯 I just scored ${wpm} WPM with ${accuracy}% accuracy on TypeMaster! ${
    passed !== undefined ? (passed ? "✅ Passed!" : "📚 Keep practicing!") : ""
  } Level ${userStats.level} | ${userStats.streak} day streak 🔥\n\nCan you beat my score? Try it now!`;

  const shareUrl = window.location.origin;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleLinkedinShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    try {
      // Create a canvas from the card
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 2; // Higher resolution
      canvas.width = 400 * scale;
      canvas.height = 500 * scale;
      ctx.scale(scale, scale);

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 400, 500);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.roundRect(0, 0, 400, 500, 20);
      ctx.fill();

      // Draw decorative elements
      ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
      ctx.beginPath();
      ctx.arc(350, 50, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(50, 450, 80, 0, Math.PI * 2);
      ctx.fill();

      // Draw title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TypeMaster Results", 200, 50);

      // Draw emoji
      ctx.font = "48px sans-serif";
      ctx.fillText(passed === true ? "🏆" : passed === false ? "📚" : "⌨️", 200, 110);

      // Draw WPM (main stat)
      ctx.font = "bold 72px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#8b5cf6";
      ctx.fillText(`${wpm}`, 200, 190);
      ctx.font = "20px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#a0a0a0";
      ctx.fillText("Words Per Minute", 200, 220);

      // Draw stats boxes
      const drawStatBox = (x: number, y: number, value: string, label: string, color: string) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.roundRect(x, y, 170, 80, 12);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(value, x + 85, y + 40);
        ctx.fillStyle = "#a0a0a0";
        ctx.font = "14px system-ui, -apple-system, sans-serif";
        ctx.fillText(label, x + 85, y + 62);
      };

      drawStatBox(20, 250, `${accuracy}%`, "Accuracy", "#10b981");
      drawStatBox(210, 250, formatTime(timeElapsed), "Time", "#f59e0b");
      drawStatBox(20, 345, `${correctChars}/${totalChars}`, "Characters", "#3b82f6");
      drawStatBox(210, 345, `Lvl ${userStats.level}`, "Level", "#ec4899");

      // Draw streak
      if (userStats.streak > 0) {
        ctx.fillStyle = "#f97316";
        ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🔥 ${userStats.streak} Day Streak`, 200, 460);
      }

      // Draw website
      ctx.fillStyle = "#666";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText("typemaster.app", 200, 485);

      // Download the image
      const link = document.createElement("a");
      link.download = `typemaster-results-${wpm}wpm.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My TypeMaster Results",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Results
          </DialogTitle>
        </DialogHeader>

        {/* Preview Card */}
        <div 
          ref={cardRef}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-6 text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <h3 className="text-white font-bold text-lg mb-2">TypeMaster Results</h3>
          <div className="text-4xl mb-2">
            {passed === true ? "🏆" : passed === false ? "📚" : "⌨️"}
          </div>
          
          <div className="text-5xl font-bold text-primary mb-1">{wpm}</div>
          <div className="text-gray-400 text-sm mb-4">Words Per Minute</div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-success font-bold text-xl">{accuracy}%</div>
              <div className="text-gray-400 text-xs">Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-amber-500 font-bold text-xl">{formatTime(timeElapsed)}</div>
              <div className="text-gray-400 text-xs">Time</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-blue-400 font-bold text-xl">{correctChars}/{totalChars}</div>
              <div className="text-gray-400 text-xs">Characters</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-pink-400 font-bold text-xl">Lvl {userStats.level}</div>
              <div className="text-gray-400 text-xs">Level</div>
            </div>
          </div>

          {userStats.streak > 0 && (
            <div className="text-orange-400 font-semibold text-sm">
              🔥 {userStats.streak} Day Streak
            </div>
          )}

          {examName && (
            <div className="text-gray-500 text-xs mt-2">
              {examName} {passed !== undefined && (passed ? "✅ Passed" : "❌ Failed")}
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            className="gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30"
            onClick={handleTwitterShare}
          >
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            Twitter
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-[#4267B2]/10 hover:bg-[#4267B2]/20 border-[#4267B2]/30"
            onClick={handleFacebookShare}
          >
            <Facebook className="w-4 h-4 text-[#4267B2]" />
            Facebook
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/30"
            onClick={handleLinkedinShare}
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            LinkedIn
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={handleDownloadImage}
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
          {navigator.share && (
            <Button
              className="flex-1 gap-2"
              onClick={handleNativeShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
