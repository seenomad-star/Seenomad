import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Users, Sword } from 'lucide-react';
import { toast } from 'sonner';
import { KeystrokeData } from '@/hooks/useTypingGame';

interface ChallengeLinkOverlayProps {
    wpm: number;
    accuracy: number;
    keystrokes: KeystrokeData[];
    text: string;
}

export const ChallengeLinkOverlay: React.FC<ChallengeLinkOverlayProps> = ({ wpm, accuracy, keystrokes, text }) => {
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        // Simplify keystrokes to reduce URL size (just index and relative timestamp)
        const startTime = keystrokes[0]?.timestamp || 0;
        const miniGhost = keystrokes.slice(0, 200).map(ks => ({
            i: ks.index,
            t: ks.timestamp - startTime,
            c: ks.isCorrect ? 1 : 0
        }));

        const data = {
            w: wpm,
            a: accuracy,
            g: miniGhost,
            txt: text.slice(0, 100) // Just a snippet to verify
        };

        // Use btoa for a simple encoded string
        const encoded = btoa(JSON.stringify(data));
        return `${window.location.origin}/?challenge=${encoded}`;
    };

    const handleCopy = () => {
        const link = generateLink();
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Challenge link copied! Send it to a friend.");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                    <Sword className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-tight text-sm">Issue a Challenge</h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Send your 'Ghost' to a rival</p>
                </div>
            </div>

            <Button
                onClick={handleCopy}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest h-12 gap-2 shadow-lg shadow-primary/20"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Challenge Link'}
            </Button>

            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                    "When a friend opens this link, they will see your 'Ghost' racer on their screen in real-time as they type."
                </p>
            </div>
        </div>
    );
};
