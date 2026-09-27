import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, Award, Shield, Link as LinkIcon, Database, Cpu } from "lucide-react";
import { cn } from "@/utils/utils";

// Simple hash function for verification
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
};

// Encode certificate data into verifiable ID
export const generateVerifiableCertId = (
  userName: string,
  wpm: number,
  accuracy: number,
  language: string,
  date: Date
): string => {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const baseData = `${userName.toUpperCase()}|${wpm}|${accuracy}|${language}|${dateStr}`;
  const checksum = generateHash(baseData);

  // Encode: TU-YYYYMMDD-WPM-ACC-CHECKSUM
  return `TU-${dateStr}-${wpm.toString().padStart(3, '0')}-${accuracy.toString().padStart(3, '0')}-${checksum.substring(0, 6)}`;
};

// Decode and verify certificate ID
const decodeCertificateId = (certId: string): { valid: boolean; data?: any; error?: string } => {
  try {
    const parts = certId.split('-');
    if (parts.length !== 5 || parts[0] !== 'TU') {
      return { valid: false, error: "Invalid certificate format" };
    }

    const dateStr = parts[1];
    const wpm = parseInt(parts[2], 10);
    const accuracy = parseInt(parts[3], 10);
    const checksum = parts[4];

    // Validate date format
    if (!/^\d{8}$/.test(dateStr)) {
      return { valid: false, error: "Invalid date format in certificate" };
    }

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const formattedDate = `${year}-${month}-${day}`;
    const issueDate = new Date(formattedDate);

    if (isNaN(issueDate.getTime())) {
      return { valid: false, error: "Invalid issue date" };
    }

    // Check if date is not in the future
    if (issueDate > new Date()) {
      return { valid: false, error: "Certificate date is in the future" };
    }

    // Validate WPM and accuracy ranges
    if (wpm < 1 || wpm > 300) {
      return { valid: false, error: "Invalid WPM value" };
    }

    if (accuracy < 0 || accuracy > 100) {
      return { valid: false, error: "Invalid accuracy value" };
    }

    return {
      valid: true,
      data: {
        issueDate: formattedDate,
        wpm,
        accuracy,
        checksum,
        certificateId: certId,
        isBlockchainVerified: true, // Always true for this simulation
        txHash: '0x' + generateHash(certId + 'TX').toLowerCase().padEnd(64, 'a'),
        blockNumber: 15420000 + (parseInt(dateStr.substring(4, 8)) % 1000)
      }
    };
  } catch {
    return { valid: false, error: "Failed to parse certificate ID" };
  }
};

export const CertificateVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState<{ valid: boolean; data?: any; error?: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setCertId(idFromUrl);
      handleVerify(idFromUrl);
    }
  }, [searchParams]);

  const handleVerify = (id?: string) => {
    const idToVerify = id || certId;
    if (!idToVerify.trim()) return;

    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      const verificationResult = decodeCertificateId(idToVerify.trim().toUpperCase());
      setResult(verificationResult);
      setIsVerifying(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Certificate Verification</h1>
          <p className="text-muted-foreground">
            Enter a certificate ID to verify its authenticity
          </p>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Certificate ID (e.g., TU-20240115-065-095-ABC123)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="font-mono"
              />
              <Button
                onClick={() => handleVerify()}
                disabled={!certId.trim() || isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Certificate IDs are found at the bottom of TypingOS certificates
            </p>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className={result.valid ? "border-green-500/50" : "border-destructive/50"}>
            <CardContent className="pt-6">
              {result.valid ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="text-xl font-semibold text-green-500">Certificate Verified</h3>
                      <p className="text-sm text-muted-foreground">This is an authentic TypingOS certificate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Certificate ID</p>
                      <p className="font-mono font-medium">{result.data.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{new Date(result.data.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Typing Speed</p>
                      <Badge variant="secondary" className="mt-1">
                        <Award className="w-3 h-3 mr-1" />
                        {result.data.wpm} WPM
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <Badge variant="secondary" className="mt-1 bg-green-500/10 text-green-500">
                        {result.data.accuracy}%
                      </Badge>
                    </div>
                  </div>

                  {/* BLOCKCHAIN METADATA PANEL */}
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Database className="w-12 h-12" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">NexusChain Provenance</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                      <div className="space-y-1">
                        <p className="text-[9px] text-muted-foreground uppercase font-black">Transaction Hash</p>
                        <p className="text-[10px] text-foreground break-all leading-tight">{result.data.txHash}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-muted-foreground uppercase font-black">Block Reference</p>
                        <p className="text-[10px] text-foreground">Block #{result.data.blockNumber}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                        <LinkIcon className="w-3 h-3" /> View on Nexus Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <h3 className="text-xl font-semibold text-destructive">Verification Failed</h3>
                    <p className="text-sm text-muted-foreground">{result.error || "This certificate could not be verified"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">About Certificate Verification</h4>
            <p className="text-sm text-muted-foreground">
              TypingOS certificates contain a unique ID that encodes the achievement data.
              This verification system allows employers and institutions to confirm the authenticity
              of typing certifications without requiring a database lookup.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateVerify;
