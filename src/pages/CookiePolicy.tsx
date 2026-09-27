import { Cookie } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
        </div>
        <p className="text-muted-foreground">Last updated: January 2026</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How We Use Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-invert max-w-none">
          <section>
            <h3 className="text-lg font-semibold text-foreground">1. What Are Cookies</h3>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences 
              and understanding how you use our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">2. Types of Cookies We Use</h3>
            <ul className="text-muted-foreground list-disc pl-5 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our site.</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and settings.</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">3. Managing Cookies</h3>
            <p className="text-muted-foreground">
              You can control and manage cookies in your browser settings. Please note that 
              removing or blocking cookies may impact your user experience and some features 
              may no longer be available.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-foreground">4. Third-Party Cookies</h3>
            <p className="text-muted-foreground">
              Some cookies are placed by third-party services that appear on our pages. 
              We do not control the use of these cookies and you should check the relevant 
              third-party's website for more information.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
