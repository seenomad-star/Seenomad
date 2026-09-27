import React from "react";
import { BlogComments } from "@/pages/BlogComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function BlogCommentsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <button
                        onClick={() => navigate("/blog")}
                        className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Blog</span>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                        Global <span className="text-primary italic">Discussion.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Sharing insights and feedback from the typing community.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest leading-none mb-1">Live Feed</div>
                        <div className="text-xs text-muted-foreground font-medium italic">Across all articles</div>
                    </div>
                </div>
            </div>

            {/* COMMENTS COMPONENT */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <BlogComments postId="global" postTitle="Global Community Feed" />
            </div>

            {/* FOOTER HINT */}
            <div className="text-center pt-8 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                    End of discussion feed • Be respectful and encouraging
                </p>
            </div>
        </div>
    );
}
