
import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseUnitProps {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    layoutKey?: string;
    className?: string;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
    slotId,
    format = 'auto',
    layoutKey,
    className
}) => {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    // Use a placeholder client ID - USER MUST REPLACE THIS
    const CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX";

    // Development mode placeholder
    if (import.meta.env.DEV) {
        return (
            <div
                className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm p-4 w-full min-h-[100px] ${className}`}
            >
                <div className="text-center">
                    <p className="font-semibold">AdSense Unit</p>
                    <p className="text-xs">Slot: {slotId}</p>
                    <p className="text-xs">Format: {format}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <ins
                className="adsbygoogle block"
                data-ad-client={CLIENT_ID}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
                {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
            />
        </div>
    );
};

export default AdSenseUnit;
