
import { ShieldCheck, Lock, Eye, Server, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Security() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">

                <header className="space-y-4">
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">Security First</Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Enterprise-Grade Protection</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        We treat your neural data with the same security standards used by financial institutions.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardHeader>
                            <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
                            <CardTitle>SOC2 Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            Our infrastructure tracks undergo regular third-party audits to ensure we meet the highest standards of availability, security, and confidentiality.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Lock className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>End-to-End Encryption</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your keystrokes are processed locally whenever possible.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Eye className="w-8 h-8 text-blue-500 mb-2" />
                            <CardTitle>Privacy by Design</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            We do not sell your data. We do not track you across other sites. Our business model is simple: you pay for premium tools, not with your privacy.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Server className="w-8 h-8 text-purple-500 mb-2" />
                            <CardTitle>Resilient Infrastructure</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm">
                            Hosted on globally distributed edge networks with 99.99% uptime SLAs and automated DDoS protection.
                        </CardContent>
                    </Card>
                </div>

                <section className="space-y-6 pt-8 border-t border-border">
                    <h2 className="text-2xl font-bold">Certifications & Standards</h2>
                    <div className="flex flex-col gap-4">
                        {[
                            "GDPR Compliant Data Processing",
                            "CCPA Ready for California Residents",
                            "Regular Penetration Testing",
                            "Bug Bounty Program Active"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
