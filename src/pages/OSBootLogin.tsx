import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Power, Cpu, ShieldCheck, Wifi } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OSBootLogin() {
    const navigate = useNavigate();
    const [bootStep, setBootStep] = useState(0);
    const [bootLogs, setBootLogs] = useState<string[]>([]);
    const [showLogin, setShowLogin] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const logs = [
        "BIOS DATE 01/15/26 14:22:54 VER 1.0.42",
        "CPU: QUANTUM CORE i9-9900K @ 5.00GHz",
        "Memory Test: 32768MP OK",
        "Detecting Primary Master ... TYPING_OS_DRIVE_01",
        "Detecting Primary Slave ... None",
        "Booting from Primary Master...",
        "Loading Kernel...",
        "Initializing Graphics Engine...",
        "Mounting File Systems... OK",
        "Starting Network Services... OK",
        "Loading Neural Interface... OK",
        "System Ready."
    ];

    useEffect(() => {
        let delay = 0;
        logs.forEach((log, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setBootLogs(prev => [...prev, log]);
                if (index === logs.length - 1) {
                    setTimeout(() => setBootStep(1), 800);
                }
            }, delay);
        });
    }, []);

    useEffect(() => {
        if (bootStep === 1) {
            setTimeout(() => setShowLogin(true), 1500); // Transition to login
        }
    }, [bootStep]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock Login
        setTimeout(() => {
            toast.success("ACCESS GRANTED");
            navigate('/'); // Redirect to dashboard
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono overflow-hidden relative selection:bg-green-500 selection:text-black">
            {/* CRT Effects */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,rgba(34,197,94,0.05)_0%,rgba(0,0,0,0.6)_100%)]" />
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanlines" />
            <div className="absolute inset-0 pointer-events-none z-40 opacity-10 animate-flicker bg-white" />

            <div className="relative z-10 p-8 h-screen flex flex-col">
                {/* Header Status */}
                <div className="flex justify-between items-center border-b border-green-500/30 pb-4 mb-4 opacity-70">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> MEM: OK</div>
                        <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> SECURE</div>
                    </div>
                    <div className="flex items-center gap-2 animate-pulse"><Wifi className="w-4 h-4" /> ONLINE</div>
                </div>

                {/* Boot Sequence */}
                {!showLogin ? (
                    <div className="flex-1 overflow-y-auto">
                        {bootLogs.map((log, i) => (
                            <div key={i} className="mb-1">{`> ${log}`}</div>
                        ))}
                        <div className="animate-pulse">_</div>
                    </div>
                ) : (
                    /* Login Form */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full"
                    >
                        <div className="w-24 h-24 border-2 border-green-500 rounded-full flex items-center justify-center mb-8 relative">
                            <Power className="w-12 h-12 animate-pulse" />
                            <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-ping opacity-20" />
                        </div>

                        <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest text-shadow-glow">
                            System Access
                        </h1>

                        <form onSubmit={handleLogin} className="w-full space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase opacity-70">User Identify</label>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-black border-green-500/50 text-green-500 focus:border-green-500 focus:ring-green-500/50 h-12 font-mono"
                                    placeholder="Enter encrypted ID..."
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase opacity-70">Passkey</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black border-green-500/50 text-green-500 focus:border-green-500 focus:ring-green-500/50 h-12 font-mono"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-green-600 hover:bg-green-700 text-black font-bold uppercase tracking-wider text-lg mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
                            </Button>
                        </form>

                        <div className="mt-8 text-xs opacity-50 text-center max-w-xs">
                            WARNING: UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED TO ADMIN.CONSOLE
                        </div>
                    </motion.div>
                )}
            </div>

            <style>{`
                .text-shadow-glow { text-shadow: 0 0 10px rgba(34,197,94,0.7); }
                @keyframes scanlines { from { background-position: 0 0; } to { background-position: 0 100%; } }
                .animate-scanlines { animation: scanlines 8s linear infinite; }
            `}</style>
        </div>
    );
}
