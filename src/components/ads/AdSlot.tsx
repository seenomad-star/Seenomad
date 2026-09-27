
import React, { useEffect, useRef } from 'react';
import { cn } from "@/utils/utils";

interface AdSlotProps {
    provider: 'google' | 'propeller';
    zoneId?: string; // For Propeller
    slotId?: string; // For Google
    type?: 'banner' | 'in-page' | 'popunder';
    orientation?: 'horizontal' | 'vertical';
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical'; // Added vertical
    className?: string;
    label?: string;
}

/**
 * Universal AdSlot Component
 * 
 * Supports both Google AdSense and PropellerAds.
 * 
 * Usage:
 * <AdSlot provider="google" slotId="12345" />
 * <AdSlot provider="propeller" zoneId="67890" />
 */
export function AdSlot({
    provider,
    zoneId,
    slotId,
    type = 'banner',
    orientation = 'horizontal',
    format = 'auto',
    className,
    label = "Sponsored Content"
}: AdSlotProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (provider === 'google') {
            try {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
            } catch (e) {
                console.error('AdSense Error:', e);
            }
        } else if (provider === 'propeller' && containerRef.current && zoneId) {
            containerRef.current.innerHTML = '';
            const script = document.createElement('script');

            if (type === 'banner' || type === 'in-page') {
                script.async = true;
                script.dataset.cfasync = "false";
                script.src = `//iclickcdn.com/tag.min.js`;
                script.setAttribute('data-zone', zoneId);
                containerRef.current.appendChild(script);
            } else if (type === 'popunder') {
                script.async = true;
                script.dataset.cfasync = "false";
                script.src = `//propush.me/ntfc.php?p=${zoneId}`;
                document.body.appendChild(script);
            }
        }
    }, [provider, zoneId, slotId, type]);

    return (
        <div className={cn(
            "ad-slot-container flex flex-col items-center",
            orientation === 'vertical' ? "h-full min-h-[600px]" : "my-8 w-full",
            className
        )}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 mb-2">
                {label}
            </span>
            <div
                ref={containerRef}
                className={cn(
                    "bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center transition-all hover:bg-white/15 animate-pulse-slow",
                    orientation === 'vertical' ? "h-full w-[160px] lg:w-[120px] xl:w-[200px] 2xl:w-[300px] min-h-[600px]" : "w-full min-h-[100px]"
                )}
            >
                {provider === 'google' && (
                    <ins
                        className="adsbygoogle block"
                        data-ad-client="ca-pub-0000000000000000" // REPLACE WITH ACTUAL PUB ID
                        data-ad-slot={slotId}
                        data-ad-format={orientation === 'vertical' ? 'vertical' : format}
                        data-full-width-responsive={orientation === 'vertical' ? "false" : "true"}
                    />
                )}

                {provider === 'propeller' && !zoneId && (
                    <div className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                        Waiting for Uplink...
                    </div>
                )}
            </div>
        </div>
    );
}
