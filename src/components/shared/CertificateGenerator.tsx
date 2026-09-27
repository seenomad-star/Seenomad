import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Download, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import { generateVerifiableCertId } from "@/pages/CertificateVerify";

interface CertificateGeneratorProps {
  wpm: number;
  accuracy: number;
  examName?: string;
  language: string;
  passed: boolean;
  timeElapsed: number;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  wpm,
  accuracy,
  examName,
  language,
  passed,
  timeElapsed,
}) => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(true);

  const generateTxHash = () => {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateCertificate = async () => {
    if (!userName.trim()) return;

    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // --- PROFESSIONAL BACKGROUND & BORDERS ---
      const primaryColor = [15, 23, 42]; // Slate 900
      const goldColor = [212, 175, 55]; // Professional Gold
      const accentColor = [59, 130, 246]; // Modern Blue

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, width, height, "F");

      // Outer Gold Frame
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(1.5);
      doc.rect(8, 8, width - 16, height - 16);

      // Inner Decorative Border
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, width - 24, height - 24);

      // Corner Accents (Decorative L-Shapes)
      const lSize = 15;
      doc.setLineWidth(2);
      // Top Left
      doc.line(8, 8 + lSize, 8, 8);
      doc.line(8, 8, 8 + lSize, 8);
      // Top Right
      doc.line(width - 8 - lSize, 8, width - 8, 8);
      doc.line(width - 8, 8, width - 8, 8 + lSize);
      // Bottom Left
      doc.line(8, height - 8 - lSize, 8, height - 8);
      doc.line(8, height - 8, 8 + lSize, height - 8);
      // Bottom Right
      doc.line(width - 8 - lSize, height - 8, width - 8, height - 8);
      doc.line(width - 8, height - 8, width - 8, height - 8 - lSize);

      // --- BRANDING & HEADER ---
      // Logo Placeholder (Using Shield Icon logic)
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.circle(width / 2, 35, 12, "F");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("TU", width / 2, 38.5, { align: "center" });

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("TYPINGOS GLOBAL CERTIFICATION", width / 2, 55, { align: "center" });

      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.5);
      doc.line(width / 2 - 40, 60, width / 2 + 40, 60);

      // --- CERTIFICATE TITLE ---
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(50);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICATE", width / 2, 85, { align: "center" });

      doc.setTextColor(180, 180, 180);
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text("OF PROFESSIONAL ACHIEVEMENT", width / 2, 95, { align: "center" });

      // --- RECIPIENT INFORMATION ---
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(12);
      doc.text("This official credential is proudly awarded to", width / 2, 110, { align: "center" });

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(38);
      doc.setFont("helvetica", "bold");
      doc.text(userName.toUpperCase(), width / 2, 130, { align: "center" });

      const nameWidth = doc.getTextWidth(userName.toUpperCase());
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setLineWidth(0.5);
      doc.line(width / 2 - nameWidth / 2 - 5, 135, width / 2 + nameWidth / 2 + 5, 135);

      // --- ACHIEVEMENT CONTENT ---
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("for demonstrating exceptional mastery in computer-human interface speed and precision", width / 2, 148, { align: "center" });

      const achievementTitle = examName
        ? `${examName} Standardized Examination`
        : "Standard Proficiency Assessment";

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text(achievementTitle, width / 2, 158, { align: "center" });

      // --- STATS GRID ---
      const boxY = 172;
      const boxW = 65;
      const boxH = 22;
      const gap = 12;
      const startX = width / 2 - (boxW * 2 + gap) / 2;

      // SPEED BOX
      doc.setFillColor(31, 41, 55); // Slate 800
      doc.roundedRect(startX, boxY, boxW, boxH, 2, 2, "F");
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.roundedRect(startX, boxY, boxW, boxH, 2, 2, "S");

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(18);
      doc.text(`${wpm} WPM`, startX + 10, boxY + 14);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(9);
      doc.text("NET SPEED", startX + 10, boxY + 7);

      // ACCURACY BOX
      doc.setFillColor(31, 41, 55);
      doc.roundedRect(startX + boxW + gap, boxY, boxW, boxH, 2, 2, "F");
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(startX + boxW + gap, boxY, boxW, boxH, 2, 2, "S");

      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFontSize(18);
      doc.text(`${accuracy}%`, startX + boxW + gap + 10, boxY + 14);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(9);
      doc.text("ACCURACY", startX + boxW + gap + 10, boxY + 7);

      // --- SIGNATURES & VALIDATION ---
      const today = new Date();
      const txHash = useBlockchain ? generateTxHash() : null;
      const certId = generateVerifiableCertId(userName, wpm, accuracy, language, today);
      const dateStr = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

      // Left Signature
      doc.setTextColor(255, 255, 255);
      doc.setFont("courier", "italic");
      doc.setFontSize(14);
      doc.text("TypingOS.Labs", 40, 215);
      doc.setDrawColor(255, 255, 255, 0.2);
      doc.line(30, 218, 85, 218);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Director of Certification", 40, 224);

      // Right Signature (Date)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(dateStr, width - 85, 215);
      doc.line(width - 85, 218, width - 30, 218);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(9);
      doc.text("Date of Issue", width - 85, 224);

      // QR / Verification Code Placeholder (As a clean minimalist box)
      doc.setFillColor(31, 41, 55);
      doc.rect(width / 2 - 15, 205, 30, 30, "F");
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2], 0.3);
      doc.rect(width / 2 - 15, 205, 30, 30, "S");

      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.setFontSize(6);
      doc.text("VERIFY ID", width / 2, 210, { align: "center" });
      doc.setFontSize(9);
      doc.text(certId.split('-').pop() || "", width / 2, 222, { align: "center" });

      // Footer Verification text
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(7);
      doc.text(`Certificate Verification ID: ${certId}`, width / 2, 243, { align: "center" });

      if (txHash) {
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2], 0.6);
        doc.text(`[ NexusChain Verified ] Tx: ${txHash.substring(0, 32)}...`, width / 2, 248, { align: "center" });
      }

      doc.setTextColor(100, 100, 100);
      doc.text(`Verify this credential at typingos.com/verify#${certId}`, width / 2, 253, { align: "center" });

      // Save the PDF
      const fileName = examName
        ? `TypingOS_Official_${examName.replace(/\s+/g, "_")}.pdf`
        : `TypingOS_Typing_Proficiency.pdf`;

      doc.save(fileName);
      setOpen(false);
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!passed) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="w-full gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 border-none h-14"
        >
          <Award className="w-6 h-6 animate-pulse" />
          Claim & Download Your Official Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Generate Your Certificate
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Congratulations on your achievement! Please enter your full legal name to generate your official TypingOS digital credential.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              This name will appear on your certificate
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-foreground">Certificate Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Speed:</div>
              <div className="text-foreground font-medium">{wpm} WPM</div>
              <div className="text-muted-foreground">Accuracy:</div>
              <div className="text-foreground font-medium">{accuracy}%</div>
              {examName && (
                <>
                  <div className="text-muted-foreground">Exam:</div>
                  <div className="text-foreground font-medium">{examName}</div>
                </>
              )}
              <div className="text-muted-foreground">Language:</div>
              <div className="text-foreground font-medium capitalize">{language}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest block">NexusChain Verification</Label>
                <span className="text-[9px] text-muted-foreground font-bold uppercase">Simulated Blockchain Proof</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={useBlockchain}
              title="NexusChain Verification"
              onChange={(e) => setUseBlockchain(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>

          <Button
            onClick={generateCertificate}
            disabled={!userName.trim() || isGenerating}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Certificate
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
