
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGamification } from "@/contexts/GamificationContext";
import { Chrome, Github, Mail, Lock, LogIn, UserPlus, Facebook, Twitter, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";


import { toast } from "sonner";

interface LoginModalProps {
    children?: React.ReactNode;
}

export function LoginModal({ children }: LoginModalProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const { login } = useGamification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulated local-only login for database-free system
        setTimeout(() => {
            if (isSignUp) {
                toast.success(t("Account Created"), { description: t("Local profile initialized.") });
                setIsSignUp(false);
            } else {
                login();
                setOpen(false);
            }
            setLoading(false);
        }, 1000);
    };

    const handleSocialLogin = async (provider: string) => {
        toast.info("Social Login Simulated", {
            description: `${provider} link established locally.`
        });
        login();
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setIsSignUp(false); }}>
                <DialogTrigger asChild>
                    {children || (
                        <Button variant="ghost" size="sm" className="gap-2">
                            <LogIn className="w-4 h-4" />
                            {t('Login')}
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-border/50 bg-transparent">
                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                        {/* Left: Illustration */}
                        <div className="hidden md:block relative bg-primary/5 p-8 flex flex-col justify-between">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-foreground mb-2">{isSignUp ? t('Start Your Journey.') : t('Join the Elite.')}</h3>
                                <p className="text-sm text-muted-foreground">{t('Unlock personalized training, advanced stats, and global tournaments.')}</p>
                            </div>
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop"
                                    alt="Join Community"
                                    className="w-full h-full object-cover opacity-20"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary text-[8px] font-black flex items-center justify-center">+15k</div>
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground italic">"The fastest way to master home row."</p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="p-8 bg-card">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-black text-foreground">
                                    {isSignUp ? t('Create Account') : t('Welcome Back')}
                                </DialogTitle>
                                <DialogDescription>
                                    {isSignUp ? t('Sign up to track your typing progress') : t('Enter your credentials to access your account')}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6">
                                <div className="grid grid-cols-5 gap-2">
                                    <Button variant="outline" size="icon" className="w-full h-10 border-white/5 bg-white/5 hover:bg-white/10" onClick={() => handleSocialLogin('google')} title="Google">
                                        <Chrome className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="w-full h-10 border-white/5 bg-white/5 hover:bg-white/10" onClick={() => handleSocialLogin('github')} title="GitHub">
                                        <Github className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="w-full h-10 border-white/5 bg-white/5 hover:bg-white/10" onClick={() => handleSocialLogin('facebook')} title="Facebook">
                                        <Facebook className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="w-full h-10 border-white/5 bg-white/5 hover:bg-white/10" onClick={() => handleSocialLogin('twitter')} title="X (Twitter)">
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="w-full h-10 border-white/5 bg-white/5 hover:bg-white/10" onClick={() => handleSocialLogin('discord')} title="Discord">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border/50" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">
                                        <span className="bg-card px-3">
                                            {t('Continue with')}
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="grid gap-4">
                                    {isSignUp && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('Username')}</Label>
                                            <div className="relative">
                                                <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="username"
                                                    placeholder="TypingMaster"
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="pl-9 h-11 bg-secondary/30 border-white/5 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('Email Address')}</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                placeholder="commander@typingos.com"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9 h-11 bg-secondary/30 border-white/5 focus:ring-primary/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                {isSignUp ? t('Password') : t('Encryption Key')}
                                            </Label>
                                            {!isSignUp && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setShowPasswordReset(true);
                                                    }}
                                                    className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
                                                >
                                                    {t('Forgot Password?')}
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9 h-11 bg-secondary/30 border-white/5 focus:ring-primary/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20" disabled={loading}>
                                        {loading ? t("Decrypting...") : (isSignUp ? t("Create Account") : t("Initialize Session"))}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:justify-center text-center text-sm text-muted-foreground">
                        <div>
                            {isSignUp ? t('Already have an account?') : t("Don't have an account?")}{" "}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-primary underline-offset-4 hover:underline font-bold"
                            >
                                {isSignUp ? t('Login') : t('Sign up')}
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <PasswordResetModal
                open={showPasswordReset}
                onOpenChange={setShowPasswordReset}
            />
        </>
    );
}
