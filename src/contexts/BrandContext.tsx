import React, { createContext, useContext, useState } from 'react';

interface BrandConfig {
    name: string;
    tagline: string;
    version: string;
    primaryColor: string;
}

interface BrandContextType {
    brand: BrandConfig;
    updateBrand: (config: Partial<BrandConfig>) => void;
}

const defaultBrand: BrandConfig = {
    name: "TypingOS",
    tagline: "The Future of Professional Typing",
    version: "2.5.0-ELITE",
    primaryColor: "#EAB308" // yellow-500
};

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brand, setBrand] = useState<BrandConfig>(defaultBrand);

    const updateBrand = (config: Partial<BrandConfig>) => {
        setBrand(prev => ({ ...prev, ...config }));
    };

    return (
        <BrandContext.Provider value={{ brand, updateBrand }}>
            {children}
        </BrandContext.Provider>
    );
};

export const useBrand = () => {
    const context = useContext(BrandContext);
    if (!context) {
        throw new Error('useBrand must be used within a BrandProvider');
    }
    return context;
};
