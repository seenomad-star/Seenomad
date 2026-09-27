import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    angle: number;
}

export const QuantumParticles: React.FC<{ x: number; y: number; trigger: any }> = ({ x, y, trigger }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const { userStats } = useGamification();
    const equippedParticle = userStats.equippedCosmetics?.particle;

    useEffect(() => {
        if (!trigger) return;

        let colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#fbbf24"];
        let count = 8;
        let longevity = 800;

        // Customize based on skin
        if (equippedParticle === 'particle_fire') {
            colors = ["#f97316", "#ef4444", "#facc15"];
            count = 12;
        } else if (equippedParticle === 'particle_ice') {
            colors = ["#0ea5e9", "#7dd3fc", "#ffffff"];
            count = 10;
        } else if (equippedParticle === 'particle_galaxy') {
            colors = ["#a855f7", "#6366f1", "#1e1b4b"];
            count = 15;
        } else if (equippedParticle === 'particle_quantum') {
            colors = ["#22d3ee", "#818cf8", "#c084fc"];
            count = 20;
        }

        const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
            id: Date.now() + i,
            x,
            y,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
            angle: (Math.PI * 2 * i) / count + (Math.random() * 0.5),
        }));

        setParticles(prev => [...prev, ...newParticles].slice(-50));

        // Cleanup after animation
        const timeout = setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [trigger]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[60]">
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: p.x,
                            y: p.y,
                            opacity: 1,
                            scale: 1,
                            rotate: 0
                        }}
                        animate={{
                            x: p.x + Math.cos(p.angle) * 100,
                            y: p.y + Math.sin(p.angle) * 100,
                            opacity: 0,
                            scale: 0,
                            rotate: 360
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-sm blur-[1px]"
                        style={{
                            width: p.size,
                            height: p.size,
                            background: p.color,
                            boxShadow: `0 0 10px ${p.color}`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
