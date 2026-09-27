import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Upload, Github, Twitter, Link as LinkIcon, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProfileUpdated?: (optimisticData?: ProfileData) => void;
    initialData?: ProfileData;
}

interface ProfileData {
    username: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    social_links: {
        github?: string;
        twitter?: string;
        website?: string;
    };
}

export function ProfileEditModal({ open, onOpenChange, onProfileUpdated, initialData }: ProfileEditModalProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        username: "",
        display_name: "",
        bio: "",
        avatar_url: "",
        social_links: {},
    });
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setProfileData(initialData);
            }
            loadProfile();
        }
    }, [open, initialData]);

    const STORAGE_KEY = 'typing-user-profile';

    const loadProfile = async () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error in loadProfile:', error);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error(t("File too large"), { description: t("Avatar must be less than 2MB") });
            return;
        }

        setUploading(true);

        try {
            // Local-only avatar "upload" (using base64 or object URL for current session)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileData(prev => ({ ...prev, avatar_url: base64String }));
                toast.success(t("Avatar updated locally"));
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error: any) {
            console.error('Error updating avatar:', error);
            toast.error(t("Update failed"));
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));

            toast.success(t("Profile updated locally"));
            onProfileUpdated?.(profileData);
            onOpenChange(false);
        } catch (error: any) {
            console.error('Save failed:', error);
            toast.error(t("Failed to save profile"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                        <User className="w-6 h-6 text-primary" />
                        {t('Edit Profile')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Update your profile information and customize your presence in TypingOS')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden shadow-2xl">
                                {profileData.avatar_url ? (
                                    <img
                                        src={profileData.avatar_url}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        <User className="w-16 h-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                ) : (
                                    <Upload className="w-8 h-8 text-white" />
                                )}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">
                            {t('Click to upload new avatar (max 2MB)')}
                        </p>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            {t('Username')} *
                        </Label>
                        <Input
                            id="username"
                            placeholder="typingmaster"
                            value={profileData.username}
                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                            className="h-11 bg-secondary/30 border-white/5"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            {t('Your unique identifier (3-20 characters)')}
                        </p>
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <Label htmlFor="display_name" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            {t('Display Name')}
                        </Label>
                        <Input
                            id="display_name"
                            placeholder="Typing Master"
                            value={profileData.display_name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                            className="h-11 bg-secondary/30 border-white/5"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            {t('Bio')}
                        </Label>
                        <Textarea
                            id="bio"
                            placeholder={t('Tell us about yourself...')}
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            className="min-h-[100px] bg-secondary/30 border-white/5 resize-none"
                            maxLength={500}
                        />
                        <p className="text-[10px] text-muted-foreground text-right">
                            {profileData.bio.length}/500
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
                            {t('Social Links')}
                        </h4>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Github className="w-3 h-3" />
                                GitHub
                            </Label>
                            <Input
                                placeholder="https://github.com/username"
                                value={profileData.social_links.github || ""}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    social_links: { ...prev.social_links, github: e.target.value }
                                }))}
                                className="h-10 bg-secondary/30 border-white/5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Twitter className="w-3 h-3" />
                                Twitter
                            </Label>
                            <Input
                                placeholder="https://twitter.com/username"
                                value={profileData.social_links.twitter || ""}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    social_links: { ...prev.social_links, twitter: e.target.value }
                                }))}
                                className="h-10 bg-secondary/30 border-white/5"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" />
                                {t('Website')}
                            </Label>
                            <Input
                                placeholder="https://yourwebsite.com"
                                value={profileData.social_links.website || ""}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    social_links: { ...prev.social_links, website: e.target.value }
                                }))}
                                className="h-10 bg-secondary/30 border-white/5"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-11 font-bold uppercase tracking-widest"
                    >
                        {t('Cancel')}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !profileData.username}
                        className="flex-1 h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t('Saving...')}
                            </>
                        ) : (
                            t('Save Changes')
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
