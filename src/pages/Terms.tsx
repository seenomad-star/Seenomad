import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Terms and Conditions</h1>
        </div>
        <p className="text-muted-foreground">Last updated: January 2026</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-invert max-w-none">
          <section>
            <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing and using TypingOS, you accept and agree to be bound by the terms
              and conditions of this agreement. If you do not agree to these terms, please do not
              use our service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">2. Use of Service</h3>
            <p className="text-muted-foreground">
              You agree to use our service only for lawful purposes and in accordance with these
              Terms. You are responsible for maintaining the confidentiality of your account
              information and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">3. Intellectual Property</h3>
            <p className="text-muted-foreground">
              All content, features, and functionality of TypingOS are owned by us and are
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">4. User Content</h3>
            <p className="text-muted-foreground">
              You retain ownership of any content you submit to our platform. By submitting content,
              you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and
              display that content in connection with our services.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h3>
            <p className="text-muted-foreground">
              TypingOS shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">6. Third-Party Content & Ads</h3>
            <p className="text-muted-foreground">
              Our service may contain links to third-party web sites or services that are not owned or
              controlled by TypingOS. We have no control over, and assume no responsibility for,
              the content, privacy policies, or practices of any third party web sites or services.
              We use Google AdSense to serve advertisements, and by using our service, you acknowledge
              and agree to our use of these third-party services.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">7. Changes to Terms</h3>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes by posting the new terms on this page.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
